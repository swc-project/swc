(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        281
    ],
    {
        /***/ 3239: /***/ function(module, __unused_webpack_exports, __webpack_require__) {
            var global, define, _require, require, normalizeModule, lookup, root;
            /* module decorator */ module = __webpack_require__.nmd(module), (global = function() {
                return this;
            }()) || "undefined" == typeof window || (global = window), (define = function(module, deps, payload) {
                if ("string" != typeof module) {
                    define.original ? define.original.apply(this, arguments) : (console.error("dropping module because define wasn't a string."), console.trace());
                    return;
                }
                2 == arguments.length && (payload = deps), define.modules[module] || (define.payloads[module] = payload, define.modules[module] = null);
            }).modules = {}, define.payloads = {}, _require = function(parentId, module, callback) {
                if ("string" == typeof module) {
                    var payload = lookup(parentId, module);
                    if (void 0 != payload) return callback && callback(), payload;
                } else if ("[object Array]" === Object.prototype.toString.call(module)) {
                    for(var params = [], i = 0, l = module.length; i < l; ++i){
                        var dep = lookup(parentId, module[i]);
                        if (void 0 == dep && require.original) return;
                        params.push(dep);
                    }
                    return callback && callback.apply(null, params) || !0;
                }
            }, require = function(module, callback) {
                var packagedModule = _require("", module, callback);
                return void 0 == packagedModule && require.original ? require.original.apply(this, arguments) : packagedModule;
            }, normalizeModule = function(parentId, moduleName) {
                // normalize plugin requires
                if (-1 !== moduleName.indexOf("!")) {
                    var chunks = moduleName.split("!");
                    return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
                }
                // normalize relative requires
                if ("." == moduleName.charAt(0)) for(moduleName = parentId.split("/").slice(0, -1).join("/") + "/" + moduleName; -1 !== moduleName.indexOf(".") && previous != moduleName;){
                    var previous = moduleName;
                    moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
                }
                return moduleName;
            }, lookup = function(parentId, moduleName) {
                moduleName = normalizeModule(parentId, moduleName);
                var module = define.modules[moduleName];
                if (!module) {
                    if ("function" == typeof (module = define.payloads[moduleName])) {
                        var exports = {}, mod = {
                            id: moduleName,
                            uri: "",
                            exports: exports,
                            packaged: !0
                        };
                        exports = module(function(module, callback) {
                            return _require(moduleName, module, callback);
                        }, exports, mod) || mod.exports, define.modules[moduleName] = exports, delete define.payloads[moduleName];
                    }
                    module = define.modules[moduleName] = exports || module;
                }
                return module;
            }, root = global, global.ace || (global.ace = {}), (root = global.ace).define && root.define.packaged || (define.original = root.define, root.define = define, root.define.packaged = !0), root.require && root.require.packaged || (require.original = root.require, root.require = require, root.require.packaged = !0), ace.define("ace/lib/fixoldbrowsers", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                "undefined" == typeof Element || Element.prototype.remove || Object.defineProperty(Element.prototype, "remove", {
                    enumerable: !1,
                    writable: !0,
                    configurable: !0,
                    value: function() {
                        this.parentNode && this.parentNode.removeChild(this);
                    }
                });
            }), ace.define("ace/lib/useragent", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                exports.OS = {
                    LINUX: "LINUX",
                    MAC: "MAC",
                    WINDOWS: "WINDOWS"
                }, exports.getOS = function() {
                    return exports.isMac ? exports.OS.MAC : exports.isLinux ? exports.OS.LINUX : exports.OS.WINDOWS;
                };
                var _navigator = "object" == typeof navigator ? navigator : {}, os = (/mac|win|linux/i.exec(_navigator.platform) || [
                    "other"
                ])[0].toLowerCase(), ua = _navigator.userAgent || "", appName = _navigator.appName || "";
                exports.isWin = "win" == os, exports.isMac = "mac" == os, exports.isLinux = "linux" == os, exports.isIE = "Microsoft Internet Explorer" == appName || appName.indexOf("MSAppHost") >= 0 ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]) : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]), exports.isOldIE = exports.isIE && exports.isIE < 9, exports.isGecko = exports.isMozilla = ua.match(/ Gecko\/\d+/), exports.isOpera = "object" == typeof opera && "[object Opera]" == Object.prototype.toString.call(window.opera), exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || void 0, exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || void 0, exports.isEdge = parseFloat(ua.split(" Edge/")[1]) || void 0, exports.isAIR = ua.indexOf("AdobeAIR") >= 0, exports.isAndroid = ua.indexOf("Android") >= 0, exports.isChromeOS = ua.indexOf(" CrOS ") >= 0, exports.isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream, exports.isIOS && (exports.isMac = !0), exports.isMobile = exports.isIOS || exports.isAndroid;
            }), ace.define("ace/lib/dom", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var strictCSP, useragent = require("./useragent");
                exports.buildDom = function buildDom(arr, parent, refs) {
                    if ("string" == typeof arr && arr) {
                        var txt = document.createTextNode(arr);
                        return parent && parent.appendChild(txt), txt;
                    }
                    if (!Array.isArray(arr)) return arr && arr.appendChild && parent && parent.appendChild(arr), arr;
                    if ("string" != typeof arr[0] || !arr[0]) {
                        for(var els = [], i = 0; i < arr.length; i++){
                            var ch = buildDom(arr[i], parent, refs);
                            ch && els.push(ch);
                        }
                        return els;
                    }
                    var el = document.createElement(arr[0]), options = arr[1], childIndex = 1;
                    options && "object" == typeof options && !Array.isArray(options) && (childIndex = 2);
                    for(var i = childIndex; i < arr.length; i++)buildDom(arr[i], el, refs);
                    return 2 == childIndex && Object.keys(options).forEach(function(n) {
                        var val = options[n];
                        "class" === n ? el.className = Array.isArray(val) ? val.join(" ") : val : "function" == typeof val || "value" == n || "$" == n[0] ? el[n] = val : "ref" === n ? refs && (refs[val] = el) : "style" === n ? "string" == typeof val && (el.style.cssText = val) : null != val && el.setAttribute(n, val);
                    }), parent && parent.appendChild(el), el;
                }, exports.getDocumentHead = function(doc) {
                    return doc || (doc = document), doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
                }, exports.createElement = function(tag, ns) {
                    return document.createElementNS ? document.createElementNS(ns || "http://www.w3.org/1999/xhtml", tag) : document.createElement(tag);
                }, exports.removeChildren = function(element) {
                    element.innerHTML = "";
                }, exports.createTextNode = function(textContent, element) {
                    return (element ? element.ownerDocument : document).createTextNode(textContent);
                }, exports.createFragment = function(element) {
                    return (element ? element.ownerDocument : document).createDocumentFragment();
                }, exports.hasCssClass = function(el, name) {
                    return -1 !== (el.className + "").split(/\s+/g).indexOf(name);
                }, exports.addCssClass = function(el, name) {
                    exports.hasCssClass(el, name) || (el.className += " " + name);
                }, exports.removeCssClass = function(el, name) {
                    for(var classes = el.className.split(/\s+/g);;){
                        var index = classes.indexOf(name);
                        if (-1 == index) break;
                        classes.splice(index, 1);
                    }
                    el.className = classes.join(" ");
                }, exports.toggleCssClass = function(el, name) {
                    for(var classes = el.className.split(/\s+/g), add = !0;;){
                        var index = classes.indexOf(name);
                        if (-1 == index) break;
                        add = !1, classes.splice(index, 1);
                    }
                    return add && classes.push(name), el.className = classes.join(" "), add;
                }, exports.setCssClass = function(node, className, include) {
                    include ? exports.addCssClass(node, className) : exports.removeCssClass(node, className);
                }, exports.hasCssString = function(id, doc) {
                    var sheets, index = 0;
                    if (sheets = (doc = doc || document).querySelectorAll("style")) {
                        for(; index < sheets.length;)if (sheets[index++].id === id) return !0;
                    }
                };
                var cssCache = [];
                function insertPendingStyles() {
                    var cache = cssCache;
                    cssCache = null, cache && cache.forEach(function(item) {
                        importCssString(item[0], item[1]);
                    });
                }
                function importCssString(cssText, id, target) {
                    if ("undefined" != typeof document) {
                        if (cssCache) {
                            if (target) insertPendingStyles();
                            else if (!1 === target) return cssCache.push([
                                cssText,
                                id
                            ]);
                        }
                        if (!strictCSP) {
                            var container = target;
                            target && target.getRootNode && (container = target.getRootNode()) && container != target || (container = document);
                            var doc = container.ownerDocument || container;
                            if (id && exports.hasCssString(id, container)) return null;
                            id && (cssText += "\n/*# sourceURL=ace/css/" + id + " */");
                            var style = exports.createElement("style");
                            style.appendChild(doc.createTextNode(cssText)), id && (style.id = id), container == doc && (container = exports.getDocumentHead(doc)), container.insertBefore(style, container.firstChild);
                        }
                    }
                }
                if (exports.useStrictCSP = function(value) {
                    strictCSP = value, !1 == value ? insertPendingStyles() : cssCache || (cssCache = []);
                }, exports.importCssString = importCssString, exports.importCssStylsheet = function(uri, doc) {
                    exports.buildDom([
                        "link",
                        {
                            rel: "stylesheet",
                            href: uri
                        }
                    ], exports.getDocumentHead(doc));
                }, exports.scrollbarWidth = function(document1) {
                    var inner = exports.createElement("ace_inner");
                    inner.style.width = "100%", inner.style.minWidth = "0px", inner.style.height = "200px", inner.style.display = "block";
                    var outer = exports.createElement("ace_outer"), style = outer.style;
                    style.position = "absolute", style.left = "-10000px", style.overflow = "hidden", style.width = "200px", style.minWidth = "0px", style.height = "150px", style.display = "block", outer.appendChild(inner);
                    var body = document1.documentElement;
                    body.appendChild(outer);
                    var noScrollbar = inner.offsetWidth;
                    style.overflow = "scroll";
                    var withScrollbar = inner.offsetWidth;
                    return noScrollbar == withScrollbar && (withScrollbar = outer.clientWidth), body.removeChild(outer), noScrollbar - withScrollbar;
                }, exports.computedStyle = function(element, style) {
                    return window.getComputedStyle(element, "") || {};
                }, exports.setStyle = function(styles, property, value) {
                    styles[property] !== value && (styles[property] = value);
                }, exports.HAS_CSS_ANIMATION = !1, exports.HAS_CSS_TRANSFORMS = !1, exports.HI_DPI = !useragent.isWin || "undefined" != typeof window && window.devicePixelRatio >= 1.5, useragent.isChromeOS && (exports.HI_DPI = !1), "undefined" != typeof document) {
                    var div = document.createElement("div");
                    exports.HI_DPI && void 0 !== div.style.transform && (exports.HAS_CSS_TRANSFORMS = !0), useragent.isEdge || void 0 === div.style.animationName || (exports.HAS_CSS_ANIMATION = !0), div = null;
                }
                exports.HAS_CSS_TRANSFORMS ? exports.translate = function(element, tx, ty) {
                    element.style.transform = "translate(" + Math.round(tx) + "px, " + Math.round(ty) + "px)";
                } : exports.translate = function(element, tx, ty) {
                    element.style.top = Math.round(ty) + "px", element.style.left = Math.round(tx) + "px";
                };
            }), ace.define("ace/lib/oop", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                exports.inherits = function(ctor, superCtor) {
                    ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    });
                }, exports.mixin = function(obj, mixin) {
                    for(var key in mixin)obj[key] = mixin[key];
                    return obj;
                }, exports.implement = function(proto, mixin) {
                    exports.mixin(proto, mixin);
                };
            }), ace.define("ace/lib/keys", [
                "require",
                "exports",
                "module",
                "ace/lib/oop"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./oop"), Keys = function() {
                    var name, i, ret = {
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
                    for(i in ret.FUNCTION_KEYS)name = ret.FUNCTION_KEYS[i].toLowerCase(), ret[name] = parseInt(i, 10);
                    for(i in ret.PRINTABLE_KEYS)name = ret.PRINTABLE_KEYS[i].toLowerCase(), ret[name] = parseInt(i, 10);
                    return oop.mixin(ret, ret.MODIFIER_KEYS), oop.mixin(ret, ret.PRINTABLE_KEYS), oop.mixin(ret, ret.FUNCTION_KEYS), ret.enter = ret.return, ret.escape = ret.esc, ret.del = ret.delete, ret[173] = "-", function() {
                        for(var mods = [
                            "cmd",
                            "ctrl",
                            "alt",
                            "shift"
                        ], i = Math.pow(2, mods.length); i--;)ret.KEY_MODS[i] = mods.filter(function(x) {
                            return i & ret.KEY_MODS[x];
                        }).join("-") + "-";
                    }(), ret.KEY_MODS[0] = "", ret.KEY_MODS[-1] = "input-", ret;
                }();
                oop.mixin(exports, Keys), exports.keyCodeToString = function(keyCode) {
                    var keyString = Keys[keyCode];
                    return "string" != typeof keyString && (keyString = String.fromCharCode(keyCode)), keyString.toLowerCase();
                };
            }), ace.define("ace/lib/event", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var activeListenerOptions, keys = require("./keys"), useragent = require("./useragent"), pressedKeys = null, ts = 0;
                function getListenerOptions() {
                    return void 0 == activeListenerOptions && function() {
                        activeListenerOptions = !1;
                        try {
                            document.createComment("").addEventListener("test", function() {}, {
                                get passive () {
                                    activeListenerOptions = {
                                        passive: !1
                                    };
                                }
                            });
                        } catch (e) {}
                    }(), activeListenerOptions;
                }
                function EventListener(elem, type, callback) {
                    this.elem = elem, this.type = type, this.callback = callback;
                }
                EventListener.prototype.destroy = function() {
                    removeListener(this.elem, this.type, this.callback), this.elem = this.type = this.callback = void 0;
                };
                var addListener = exports.addListener = function(elem, type, callback, destroyer) {
                    elem.addEventListener(type, callback, getListenerOptions()), destroyer && destroyer.$toDestroy.push(new EventListener(elem, type, callback));
                }, removeListener = exports.removeListener = function(elem, type, callback) {
                    elem.removeEventListener(type, callback, getListenerOptions());
                };
                exports.stopEvent = function(e) {
                    return exports.stopPropagation(e), exports.preventDefault(e), !1;
                }, exports.stopPropagation = function(e) {
                    e.stopPropagation && e.stopPropagation();
                }, exports.preventDefault = function(e) {
                    e.preventDefault && e.preventDefault();
                }, exports.getButton = function(e) {
                    return "dblclick" == e.type ? 0 : "contextmenu" == e.type || useragent.isMac && e.ctrlKey && !e.altKey && !e.shiftKey ? 2 : e.button;
                }, exports.capture = function(el, eventHandler, releaseCaptureHandler) {
                    var ownerDocument = el && el.ownerDocument || document;
                    function onMouseUp(e) {
                        eventHandler && eventHandler(e), releaseCaptureHandler && releaseCaptureHandler(e), removeListener(ownerDocument, "mousemove", eventHandler), removeListener(ownerDocument, "mouseup", onMouseUp), removeListener(ownerDocument, "dragstart", onMouseUp);
                    }
                    return addListener(ownerDocument, "mousemove", eventHandler), addListener(ownerDocument, "mouseup", onMouseUp), addListener(ownerDocument, "dragstart", onMouseUp), onMouseUp;
                }, exports.addMouseWheelListener = function(el, callback, destroyer) {
                    "onmousewheel" in el ? addListener(el, "mousewheel", function(e) {
                        void 0 !== e.wheelDeltaX ? (e.wheelX = -e.wheelDeltaX / 8, e.wheelY = -e.wheelDeltaY / 8) : (e.wheelX = 0, e.wheelY = -e.wheelDelta / 8), callback(e);
                    }, destroyer) : "onwheel" in el ? addListener(el, "wheel", function(e) {
                        switch(e.deltaMode){
                            case e.DOM_DELTA_PIXEL:
                                e.wheelX = 0.35 * e.deltaX || 0, e.wheelY = 0.35 * e.deltaY || 0;
                                break;
                            case e.DOM_DELTA_LINE:
                            case e.DOM_DELTA_PAGE:
                                e.wheelX = 5 * (e.deltaX || 0), e.wheelY = 5 * (e.deltaY || 0);
                        }
                        callback(e);
                    }, destroyer) : addListener(el, "DOMMouseScroll", function(e) {
                        e.axis && e.axis == e.HORIZONTAL_AXIS ? (e.wheelX = 5 * (e.detail || 0), e.wheelY = 0) : (e.wheelX = 0, e.wheelY = 5 * (e.detail || 0)), callback(e);
                    }, destroyer);
                }, exports.addMultiMouseDownListener = function(elements, timeouts, eventHandler, callbackName, destroyer) {
                    var startX, startY, timer, clicks = 0, eventNames = {
                        2: "dblclick",
                        3: "tripleclick",
                        4: "quadclick"
                    };
                    function onMousedown(e) {
                        if (0 !== exports.getButton(e) ? clicks = 0 : e.detail > 1 ? ++clicks > 4 && (clicks = 1) : clicks = 1, useragent.isIE) {
                            var isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
                            (!timer || isNewClick) && (clicks = 1), timer && clearTimeout(timer), timer = setTimeout(function() {
                                timer = null;
                            }, timeouts[clicks - 1] || 600), 1 == clicks && (startX = e.clientX, startY = e.clientY);
                        }
                        if (e._clicks = clicks, eventHandler[callbackName]("mousedown", e), clicks > 4) clicks = 0;
                        else if (clicks > 1) return eventHandler[callbackName](eventNames[clicks], e);
                    }
                    Array.isArray(elements) || (elements = [
                        elements
                    ]), elements.forEach(function(el) {
                        addListener(el, "mousedown", onMousedown, destroyer);
                    });
                };
                var getModifierHash = function(e) {
                    return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
                };
                function normalizeCommandKeys(callback, e, keyCode) {
                    var hashId = getModifierHash(e);
                    if (!useragent.isMac && pressedKeys) {
                        if (e.getModifierState && (e.getModifierState("OS") || e.getModifierState("Win")) && (hashId |= 8), pressedKeys.altGr) {
                            if ((3 & hashId) == 3) return;
                            pressedKeys.altGr = 0;
                        }
                        if (18 === keyCode || 17 === keyCode) {
                            var location = "location" in e ? e.location : e.keyLocation;
                            17 === keyCode && 1 === location ? 1 == pressedKeys[keyCode] && (ts = e.timeStamp) : 18 === keyCode && 3 === hashId && 2 === location && e.timeStamp - ts < 50 && (pressedKeys.altGr = !0);
                        }
                    }
                    if (keyCode in keys.MODIFIER_KEYS && (keyCode = -1), !hashId && 13 === keyCode) {
                        var location = "location" in e ? e.location : e.keyLocation;
                        if (3 === location && (callback(e, hashId, -keyCode), e.defaultPrevented)) return;
                    }
                    if (useragent.isChromeOS && 8 & hashId) {
                        if (callback(e, hashId, keyCode), e.defaultPrevented) return;
                        hashId &= -9;
                    }
                    return (!!hashId || keyCode in keys.FUNCTION_KEYS || keyCode in keys.PRINTABLE_KEYS) && callback(e, hashId, keyCode);
                }
                function resetPressedKeys() {
                    pressedKeys = Object.create(null);
                }
                if (exports.getModifierString = function(e) {
                    return keys.KEY_MODS[getModifierHash(e)];
                }, exports.addCommandKeyListener = function(el, callback, destroyer) {
                    if (!useragent.isOldGecko && (!useragent.isOpera || "KeyboardEvent" in window)) {
                        var lastDefaultPrevented = null;
                        addListener(el, "keydown", function(e) {
                            pressedKeys[e.keyCode] = (pressedKeys[e.keyCode] || 0) + 1;
                            var result = normalizeCommandKeys(callback, e, e.keyCode);
                            return lastDefaultPrevented = e.defaultPrevented, result;
                        }, destroyer), addListener(el, "keypress", function(e) {
                            lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && (exports.stopEvent(e), lastDefaultPrevented = null);
                        }, destroyer), addListener(el, "keyup", function(e) {
                            pressedKeys[e.keyCode] = null;
                        }, destroyer), pressedKeys || (resetPressedKeys(), addListener(window, "focus", resetPressedKeys));
                    } else {
                        var lastKeyDownKeyCode = null;
                        addListener(el, "keydown", function(e) {
                            lastKeyDownKeyCode = e.keyCode;
                        }, destroyer), addListener(el, "keypress", function(e) {
                            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
                        }, destroyer);
                    }
                }, "object" == typeof window && window.postMessage && !useragent.isOldIE) {
                    var postMessageId = 1;
                    exports.nextTick = function(callback, win) {
                        win = win || window;
                        var messageName = "zero-timeout-message-" + postMessageId++, listener = function(e) {
                            e.data == messageName && (exports.stopPropagation(e), removeListener(win, "message", listener), callback());
                        };
                        addListener(win, "message", listener), win.postMessage(messageName, "*");
                    };
                }
                exports.$idleBlocked = !1, exports.onIdle = function(cb, timeout) {
                    return setTimeout(function handler() {
                        exports.$idleBlocked ? setTimeout(handler, 100) : cb();
                    }, timeout);
                }, exports.$idleBlockId = null, exports.blockIdle = function(delay) {
                    exports.$idleBlockId && clearTimeout(exports.$idleBlockId), exports.$idleBlocked = !0, exports.$idleBlockId = setTimeout(function() {
                        exports.$idleBlocked = !1;
                    }, delay || 100);
                }, exports.nextFrame = "object" == typeof window && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame), exports.nextFrame ? exports.nextFrame = exports.nextFrame.bind(window) : exports.nextFrame = function(callback) {
                    setTimeout(callback, 17);
                };
            }), ace.define("ace/range", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                var Range = function(startRow, startColumn, endRow, endColumn) {
                    this.start = {
                        row: startRow,
                        column: startColumn
                    }, this.end = {
                        row: endRow,
                        column: endColumn
                    };
                };
                (function() {
                    this.isEqual = function(range) {
                        return this.start.row === range.start.row && this.end.row === range.end.row && this.start.column === range.start.column && this.end.column === range.end.column;
                    }, this.toString = function() {
                        return "Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]";
                    }, this.contains = function(row, column) {
                        return 0 == this.compare(row, column);
                    }, this.compareRange = function(range) {
                        var cmp, end = range.end, start = range.start;
                        return 1 == (cmp = this.compare(end.row, end.column)) ? 1 == (cmp = this.compare(start.row, start.column)) ? 2 : 0 == cmp ? 1 : 0 : -1 == cmp ? -2 : -1 == (cmp = this.compare(start.row, start.column)) ? -1 : 1 == cmp ? 42 : 0;
                    }, this.comparePoint = function(p) {
                        return this.compare(p.row, p.column);
                    }, this.containsRange = function(range) {
                        return 0 == this.comparePoint(range.start) && 0 == this.comparePoint(range.end);
                    }, this.intersects = function(range) {
                        var cmp = this.compareRange(range);
                        return -1 == cmp || 0 == cmp || 1 == cmp;
                    }, this.isEnd = function(row, column) {
                        return this.end.row == row && this.end.column == column;
                    }, this.isStart = function(row, column) {
                        return this.start.row == row && this.start.column == column;
                    }, this.setStart = function(row, column) {
                        "object" == typeof row ? (this.start.column = row.column, this.start.row = row.row) : (this.start.row = row, this.start.column = column);
                    }, this.setEnd = function(row, column) {
                        "object" == typeof row ? (this.end.column = row.column, this.end.row = row.row) : (this.end.row = row, this.end.column = column);
                    }, this.inside = function(row, column) {
                        return !(0 != this.compare(row, column) || this.isEnd(row, column) || this.isStart(row, column));
                    }, this.insideStart = function(row, column) {
                        return !(0 != this.compare(row, column) || this.isEnd(row, column));
                    }, this.insideEnd = function(row, column) {
                        return !(0 != this.compare(row, column) || this.isStart(row, column));
                    }, this.compare = function(row, column) {
                        return this.isMultiLine() || row !== this.start.row ? row < this.start.row ? -1 : row > this.end.row ? 1 : this.start.row === row ? column >= this.start.column ? 0 : -1 : this.end.row === row ? column <= this.end.column ? 0 : 1 : 0 : column < this.start.column ? -1 : column > this.end.column ? 1 : 0;
                    }, this.compareStart = function(row, column) {
                        return this.start.row == row && this.start.column == column ? -1 : this.compare(row, column);
                    }, this.compareEnd = function(row, column) {
                        return this.end.row == row && this.end.column == column ? 1 : this.compare(row, column);
                    }, this.compareInside = function(row, column) {
                        return this.end.row == row && this.end.column == column ? 1 : this.start.row == row && this.start.column == column ? -1 : this.compare(row, column);
                    }, this.clipRows = function(firstRow, lastRow) {
                        if (this.end.row > lastRow) var end = {
                            row: lastRow + 1,
                            column: 0
                        };
                        else if (this.end.row < firstRow) var end = {
                            row: firstRow,
                            column: 0
                        };
                        if (this.start.row > lastRow) var start = {
                            row: lastRow + 1,
                            column: 0
                        };
                        else if (this.start.row < firstRow) var start = {
                            row: firstRow,
                            column: 0
                        };
                        return Range.fromPoints(start || this.start, end || this.end);
                    }, this.extend = function(row, column) {
                        var cmp = this.compare(row, column);
                        if (0 == cmp) return this;
                        if (-1 == cmp) var start = {
                            row: row,
                            column: column
                        };
                        else var end = {
                            row: row,
                            column: column
                        };
                        return Range.fromPoints(start || this.start, end || this.end);
                    }, this.isEmpty = function() {
                        return this.start.row === this.end.row && this.start.column === this.end.column;
                    }, this.isMultiLine = function() {
                        return this.start.row !== this.end.row;
                    }, this.clone = function() {
                        return Range.fromPoints(this.start, this.end);
                    }, this.collapseRows = function() {
                        return 0 == this.end.column ? new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0) : new Range(this.start.row, 0, this.end.row, 0);
                    }, this.toScreenRange = function(session) {
                        var screenPosStart = session.documentToScreenPosition(this.start), screenPosEnd = session.documentToScreenPosition(this.end);
                        return new Range(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
                    }, this.moveBy = function(row, column) {
                        this.start.row += row, this.start.column += column, this.end.row += row, this.end.column += column;
                    };
                }).call(Range.prototype), Range.fromPoints = function(start, end) {
                    return new Range(start.row, start.column, end.row, end.column);
                }, Range.comparePoints = function(p1, p2) {
                    return p1.row - p2.row || p1.column - p2.column;
                }, Range.comparePoints = function(p1, p2) {
                    return p1.row - p2.row || p1.column - p2.column;
                }, exports.Range = Range;
            }), ace.define("ace/lib/lang", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                exports.last = function(a) {
                    return a[a.length - 1];
                }, exports.stringReverse = function(string) {
                    return string.split("").reverse().join("");
                }, exports.stringRepeat = function(string, count) {
                    for(var result = ""; count > 0;)1 & count && (result += string), (count >>= 1) && (string += string);
                    return result;
                };
                var trimBeginRegexp = /^\s\s*/, trimEndRegexp = /\s\s*$/;
                exports.stringTrimLeft = function(string) {
                    return string.replace(trimBeginRegexp, "");
                }, exports.stringTrimRight = function(string) {
                    return string.replace(trimEndRegexp, "");
                }, exports.copyObject = function(obj) {
                    var copy = {};
                    for(var key in obj)copy[key] = obj[key];
                    return copy;
                }, exports.copyArray = function(array) {
                    for(var copy = [], i = 0, l = array.length; i < l; i++)array[i] && "object" == typeof array[i] ? copy[i] = this.copyObject(array[i]) : copy[i] = array[i];
                    return copy;
                }, exports.deepCopy = function deepCopy(obj) {
                    if ("object" != typeof obj || !obj) return obj;
                    if (Array.isArray(obj)) {
                        copy = [];
                        for(var copy, key = 0; key < obj.length; key++)copy[key] = deepCopy(obj[key]);
                        return copy;
                    }
                    if ("[object Object]" !== Object.prototype.toString.call(obj)) return obj;
                    for(var key in copy = {}, obj)copy[key] = deepCopy(obj[key]);
                    return copy;
                }, exports.arrayToMap = function(arr) {
                    for(var map = {}, i = 0; i < arr.length; i++)map[arr[i]] = 1;
                    return map;
                }, exports.createMap = function(props) {
                    var map = Object.create(null);
                    for(var i in props)map[i] = props[i];
                    return map;
                }, exports.arrayRemove = function(array, value) {
                    for(var i = 0; i <= array.length; i++)value === array[i] && array.splice(i, 1);
                }, exports.escapeRegExp = function(str) {
                    return str.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
                }, exports.escapeHTML = function(str) {
                    return ("" + str).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
                }, exports.getMatchOffsets = function(string, regExp) {
                    var matches = [];
                    return string.replace(regExp, function(str) {
                        matches.push({
                            offset: arguments[arguments.length - 2],
                            length: str.length
                        });
                    }), matches;
                }, exports.deferredCall = function(fcn) {
                    var timer = null, callback = function() {
                        timer = null, fcn();
                    }, deferred = function(timeout) {
                        return deferred.cancel(), timer = setTimeout(callback, timeout || 0), deferred;
                    };
                    return deferred.schedule = deferred, deferred.call = function() {
                        return this.cancel(), fcn(), deferred;
                    }, deferred.cancel = function() {
                        return clearTimeout(timer), timer = null, deferred;
                    }, deferred.isPending = function() {
                        return timer;
                    }, deferred;
                }, exports.delayedCall = function(fcn, defaultTimeout) {
                    var timer = null, callback = function() {
                        timer = null, fcn();
                    }, _self = function(timeout) {
                        null == timer && (timer = setTimeout(callback, timeout || defaultTimeout));
                    };
                    return _self.delay = function(timeout) {
                        timer && clearTimeout(timer), timer = setTimeout(callback, timeout || defaultTimeout);
                    }, _self.schedule = _self, _self.call = function() {
                        this.cancel(), fcn();
                    }, _self.cancel = function() {
                        timer && clearTimeout(timer), timer = null;
                    }, _self.isPending = function() {
                        return timer;
                    }, _self;
                };
            }), ace.define("ace/clipboard", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                var $cancelT;
                module.exports = {
                    lineMode: !1,
                    pasteCancelled: function() {
                        return !!($cancelT && $cancelT > Date.now() - 50) || ($cancelT = !1);
                    },
                    cancel: function() {
                        $cancelT = Date.now();
                    }
                };
            }), ace.define("ace/keyboard/textinput", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/clipboard",
                "ace/lib/keys"
            ], function(require, exports, module) {
                "use strict";
                var event = require("../lib/event"), useragent = require("../lib/useragent"), dom = require("../lib/dom"), lang = require("../lib/lang"), clipboard = require("../clipboard"), BROKEN_SETDATA = useragent.isChrome < 18, USE_IE_MIME_TYPE = useragent.isIE, HAS_FOCUS_ARGS = useragent.isChrome > 63, KEYS = require("../lib/keys"), MODS = KEYS.KEY_MODS, isIOS = useragent.isIOS, valueResetRegex = isIOS ? /\s/ : /\n/, isMobile = useragent.isMobile;
                exports.TextInput = function(parentNode, host) {
                    var typingResetTimeout, typing, detectArrowKeys, closeTimeout, text = dom.createElement("textarea");
                    text.className = "ace_text-input", text.setAttribute("wrap", "off"), text.setAttribute("autocorrect", "off"), text.setAttribute("autocapitalize", "off"), text.setAttribute("spellcheck", !1), text.style.opacity = "0", parentNode.insertBefore(text, parentNode.firstChild);
                    var copied = !1, pasted = !1, inComposition = !1, sendingText = !1, tempStyle = "";
                    isMobile || (text.style.fontSize = "1px");
                    var commandMode = !1, ignoreFocusEvents = !1, lastValue = "", lastSelectionStart = 0, lastSelectionEnd = 0, lastRestoreEnd = 0;
                    try {
                        var isFocused = document.activeElement === text;
                    } catch (e) {}
                    event.addListener(text, "blur", function(e) {
                        ignoreFocusEvents || (host.onBlur(e), isFocused = !1);
                    }, host), event.addListener(text, "focus", function(e) {
                        if (!ignoreFocusEvents) {
                            if (isFocused = !0, useragent.isEdge) try {
                                if (!document.hasFocus()) return;
                            } catch (e) {}
                            host.onFocus(e), useragent.isEdge ? setTimeout(resetSelection) : resetSelection();
                        }
                    }, host), this.$focusScroll = !1, this.focus = function() {
                        if (tempStyle || HAS_FOCUS_ARGS || "browser" == this.$focusScroll) return text.focus({
                            preventScroll: !0
                        });
                        var top = text.style.top;
                        text.style.position = "fixed", text.style.top = "0px";
                        try {
                            var isTransformed = 0 != text.getBoundingClientRect().top;
                        } catch (e) {
                            return;
                        }
                        var ancestors = [];
                        if (isTransformed) for(var t = text.parentElement; t && 1 == t.nodeType;)ancestors.push(t), t.setAttribute("ace_nocontext", !0), t = !t.parentElement && t.getRootNode ? t.getRootNode().host : t.parentElement;
                        text.focus({
                            preventScroll: !0
                        }), isTransformed && ancestors.forEach(function(p) {
                            p.removeAttribute("ace_nocontext");
                        }), setTimeout(function() {
                            text.style.position = "", "0px" == text.style.top && (text.style.top = top);
                        }, 0);
                    }, this.blur = function() {
                        text.blur();
                    }, this.isFocused = function() {
                        return isFocused;
                    }, host.on("beforeEndOperation", function() {
                        var curOp = host.curOp, commandName = curOp && curOp.command && curOp.command.name;
                        if ("insertstring" != commandName) {
                            var isUserAction = commandName && (curOp.docChanged || curOp.selectionChanged);
                            inComposition && isUserAction && (lastValue = text.value = "", onCompositionEnd()), resetSelection();
                        }
                    });
                    var resetSelection = isIOS ? function(value) {
                        if (isFocused && (!copied || value) && !sendingText) {
                            value || (value = "");
                            var newValue = "\n ab" + value + "cde fg\n";
                            newValue != text.value && (text.value = lastValue = newValue);
                            var selectionEnd = 4 + (value.length || (host.selection.isEmpty() ? 0 : 1));
                            (4 != lastSelectionStart || lastSelectionEnd != selectionEnd) && text.setSelectionRange(4, selectionEnd), lastSelectionStart = 4, lastSelectionEnd = selectionEnd;
                        }
                    } : function() {
                        if (!inComposition && !sendingText && (isFocused || afterContextMenu)) {
                            inComposition = !0;
                            var selectionStart = 0, selectionEnd = 0, line = "";
                            if (host.session) {
                                var selection = host.selection, range = selection.getRange(), row = selection.cursor.row;
                                if (selectionStart = range.start.column, selectionEnd = range.end.column, line = host.session.getLine(row), range.start.row != row) {
                                    var prevLine = host.session.getLine(row - 1);
                                    selectionStart = range.start.row < row - 1 ? 0 : selectionStart, selectionEnd += prevLine.length + 1, line = prevLine + "\n" + line;
                                } else if (range.end.row != row) {
                                    var nextLine = host.session.getLine(row + 1);
                                    selectionEnd = (range.end.row > row + 1 ? nextLine.length : selectionEnd) + (line.length + 1), line = line + "\n" + nextLine;
                                } else isMobile && row > 0 && (line = "\n" + line, selectionEnd += 1, selectionStart += 1);
                                line.length > 400 && (selectionStart < 400 && selectionEnd < 400 ? line = line.slice(0, 400) : (line = "\n", selectionStart == selectionEnd ? selectionStart = selectionEnd = 0 : (selectionStart = 0, selectionEnd = 1)));
                            }
                            var newValue = line + "\n\n";
                            if (newValue != lastValue && (text.value = lastValue = newValue, lastSelectionStart = lastSelectionEnd = newValue.length), afterContextMenu && (lastSelectionStart = text.selectionStart, lastSelectionEnd = text.selectionEnd), lastSelectionEnd != selectionEnd || lastSelectionStart != selectionStart || text.selectionEnd != lastSelectionEnd // on ie edge selectionEnd changes silently after the initialization
                            ) try {
                                text.setSelectionRange(selectionStart, selectionEnd), lastSelectionStart = selectionStart, lastSelectionEnd = selectionEnd;
                            } catch (e) {}
                            inComposition = !1;
                        }
                    };
                    this.resetSelection = resetSelection, isFocused && host.onFocus();
                    var inputHandler = null;
                    this.setInputHandler = function(cb) {
                        inputHandler = cb;
                    }, this.getInputHandler = function() {
                        return inputHandler;
                    };
                    var afterContextMenu = !1, sendText = function(value, fromInput) {
                        if (afterContextMenu && (afterContextMenu = !1), pasted) return resetSelection(), value && host.onPaste(value), pasted = !1, "";
                        for(var selectionStart = text.selectionStart, selectionEnd = text.selectionEnd, extendLeft = lastSelectionStart, extendRight = lastValue.length - lastSelectionEnd, inserted = value, restoreStart = value.length - selectionStart, restoreEnd = value.length - selectionEnd, i = 0; extendLeft > 0 && lastValue[i] == value[i];)i++, extendLeft--;
                        for(inserted = inserted.slice(i), i = 1; extendRight > 0 && lastValue.length - i > lastSelectionStart - 1 && lastValue[lastValue.length - i] == value[value.length - i];)i++, extendRight--;
                        restoreStart -= i - 1, restoreEnd -= i - 1;
                        var endIndex = inserted.length - i + 1;
                        if (endIndex < 0 && (extendLeft = -endIndex, endIndex = 0), inserted = inserted.slice(0, endIndex), !fromInput && !inserted && !restoreStart && !extendLeft && !extendRight && !restoreEnd) return "";
                        sendingText = !0;
                        var shouldReset = !1;
                        return useragent.isAndroid && ". " == inserted && (inserted = "  ", shouldReset = !0), (!inserted || extendLeft || extendRight || restoreStart || restoreEnd) && !commandMode ? host.onTextInput(inserted, {
                            extendLeft: extendLeft,
                            extendRight: extendRight,
                            restoreStart: restoreStart,
                            restoreEnd: restoreEnd
                        }) : host.onTextInput(inserted), sendingText = !1, lastValue = value, lastSelectionStart = selectionStart, lastSelectionEnd = selectionEnd, lastRestoreEnd = restoreEnd, shouldReset ? "\n" : inserted;
                    }, onInput = function(e) {
                        if (inComposition) return onCompositionUpdate();
                        if (e && e.inputType) {
                            if ("historyUndo" == e.inputType) return host.execCommand("undo");
                            if ("historyRedo" == e.inputType) return host.execCommand("redo");
                        }
                        var data = text.value, inserted = sendText(data, !0);
                        (data.length > 500 || valueResetRegex.test(inserted) || isMobile && lastSelectionStart < 1 && lastSelectionStart == lastSelectionEnd) && resetSelection();
                    }, handleClipboardData = function(e, data, forceIEMime) {
                        var clipboardData = e.clipboardData || window.clipboardData;
                        if (clipboardData && !BROKEN_SETDATA) {
                            var mime = USE_IE_MIME_TYPE || forceIEMime ? "Text" : "text/plain";
                            try {
                                if (data) return !1 !== clipboardData.setData(mime, data);
                                return clipboardData.getData(mime);
                            } catch (e) {
                                if (!forceIEMime) return handleClipboardData(e, data, !0);
                            }
                        }
                    }, doCopy = function(e, isCut) {
                        var data = host.getCopyText();
                        if (!data) return event.preventDefault(e);
                        handleClipboardData(e, data) ? (isIOS && (resetSelection(data), copied = data, setTimeout(function() {
                            copied = !1;
                        }, 10)), isCut ? host.onCut() : host.onCopy(), event.preventDefault(e)) : (copied = !0, text.value = data, text.select(), setTimeout(function() {
                            copied = !1, resetSelection(), isCut ? host.onCut() : host.onCopy();
                        }));
                    }, onCut = function(e) {
                        doCopy(e, !0);
                    }, onCopy = function(e) {
                        doCopy(e, !1);
                    }, onPaste = function(e) {
                        var data = handleClipboardData(e);
                        clipboard.pasteCancelled() || ("string" == typeof data ? (data && host.onPaste(data, e), useragent.isIE && setTimeout(resetSelection), event.preventDefault(e)) : (text.value = "", pasted = !0));
                    };
                    event.addCommandKeyListener(text, host.onCommandKey.bind(host), host), event.addListener(text, "select", function(e) {
                        !inComposition && (copied ? copied = !1 : 0 === text.selectionStart && text.selectionEnd >= lastValue.length && text.value === lastValue && lastValue && text.selectionEnd !== lastSelectionEnd ? (host.selectAll(), resetSelection()) : isMobile && text.selectionStart != lastSelectionStart && resetSelection());
                    }, host), event.addListener(text, "input", onInput, host), event.addListener(text, "cut", onCut, host), event.addListener(text, "copy", onCopy, host), event.addListener(text, "paste", onPaste, host), "oncut" in text && "oncopy" in text && "onpaste" in text || event.addListener(parentNode, "keydown", function(e) {
                        if ((!useragent.isMac || e.metaKey) && e.ctrlKey) switch(e.keyCode){
                            case 67:
                                onCopy(e);
                                break;
                            case 86:
                                onPaste(e);
                                break;
                            case 88:
                                onCut(e);
                        }
                    }, host);
                    var onCompositionUpdate = function() {
                        if (inComposition && host.onCompositionUpdate && !host.$readOnly) {
                            if (commandMode) return cancelComposition();
                            inComposition.useTextareaForIME ? host.onCompositionUpdate(text.value) : (sendText(text.value), inComposition.markerRange && (inComposition.context && (inComposition.markerRange.start.column = inComposition.selectionStart = inComposition.context.compositionStartOffset), inComposition.markerRange.end.column = inComposition.markerRange.start.column + lastSelectionEnd - inComposition.selectionStart + lastRestoreEnd));
                        }
                    }, onCompositionEnd = function(e) {
                        host.onCompositionEnd && !host.$readOnly && (inComposition = !1, host.onCompositionEnd(), host.off("mousedown", cancelComposition), e && onInput());
                    };
                    function cancelComposition() {
                        ignoreFocusEvents = !0, text.blur(), text.focus(), ignoreFocusEvents = !1;
                    }
                    var syncComposition = lang.delayedCall(onCompositionUpdate, 50).schedule.bind(null, null);
                    function onContextMenuClose() {
                        clearTimeout(closeTimeout), closeTimeout = setTimeout(function() {
                            tempStyle && (text.style.cssText = tempStyle, tempStyle = ""), host.renderer.$isMousePressed = !1, host.renderer.$keepTextAreaAtCursor && host.renderer.$moveTextAreaToCursor();
                        }, 0);
                    }
                    event.addListener(text, "compositionstart", function(e) {
                        if (!inComposition && host.onCompositionStart && !host.$readOnly && (inComposition = {}, !commandMode)) {
                            e.data && (inComposition.useTextareaForIME = !1), setTimeout(onCompositionUpdate, 0), host._signal("compositionStart"), host.on("mousedown", cancelComposition);
                            var range = host.getSelectionRange();
                            range.end.row = range.start.row, range.end.column = range.start.column, inComposition.markerRange = range, inComposition.selectionStart = lastSelectionStart, host.onCompositionStart(inComposition), inComposition.useTextareaForIME ? (lastValue = text.value = "", lastSelectionStart = 0, lastSelectionEnd = 0) : (text.msGetInputContext && (inComposition.context = text.msGetInputContext()), text.getInputContext && (inComposition.context = text.getInputContext()));
                        }
                    }, host), event.addListener(text, "compositionupdate", onCompositionUpdate, host), event.addListener(text, "keyup", function(e) {
                        27 == e.keyCode && text.value.length < text.selectionStart && (inComposition || (lastValue = text.value), lastSelectionStart = lastSelectionEnd = -1, resetSelection()), syncComposition();
                    }, host), event.addListener(text, "keydown", syncComposition, host), event.addListener(text, "compositionend", onCompositionEnd, host), this.getElement = function() {
                        return text;
                    }, this.setCommandMode = function(value) {
                        commandMode = value, text.readOnly = !1;
                    }, this.setReadOnly = function(readOnly) {
                        commandMode || (text.readOnly = readOnly);
                    }, this.setCopyWithEmptySelection = function(value) {}, this.onContextMenu = function(e) {
                        afterContextMenu = !0, resetSelection(), host._emit("nativecontextmenu", {
                            target: host,
                            domEvent: e
                        }), this.moveToMouse(e, !0);
                    }, this.moveToMouse = function(e, bringToFront) {
                        tempStyle || (tempStyle = text.style.cssText), text.style.cssText = (bringToFront ? "z-index:100000;" : "") + (useragent.isIE ? "opacity:0.1;" : "") + "text-indent: -" + (lastSelectionStart + lastSelectionEnd) * host.renderer.characterWidth * 0.5 + "px;";
                        var rect = host.container.getBoundingClientRect(), style = dom.computedStyle(host.container), top = rect.top + (parseInt(style.borderTopWidth) || 0), left = rect.left + (parseInt(rect.borderLeftWidth) || 0), maxTop = rect.bottom - top - text.clientHeight - 2, move = function(e) {
                            dom.translate(text, e.clientX - left - 2, Math.min(e.clientY - top - 2, maxTop));
                        };
                        move(e), "mousedown" == e.type && (host.renderer.$isMousePressed = !0, clearTimeout(closeTimeout), useragent.isWin && event.capture(host.container, move, onContextMenuClose));
                    }, this.onContextMenuClose = onContextMenuClose;
                    var onContextMenu = function(e) {
                        host.textInput.onContextMenu(e), onContextMenuClose();
                    };
                    event.addListener(text, "mouseup", onContextMenu, host), event.addListener(text, "mousedown", function(e) {
                        e.preventDefault(), onContextMenuClose();
                    }, host), event.addListener(host.renderer.scroller, "contextmenu", onContextMenu, host), event.addListener(text, "contextmenu", onContextMenu, host), isIOS && (typingResetTimeout = null, typing = !1, text.addEventListener("keydown", function(e) {
                        typingResetTimeout && clearTimeout(typingResetTimeout), typing = !0;
                    }, !0), text.addEventListener("keyup", function(e) {
                        typingResetTimeout = setTimeout(function() {
                            typing = !1;
                        }, 100);
                    }, !0), detectArrowKeys = function(e) {
                        if (document.activeElement === text && !typing && !inComposition && !host.$mouseHandler.isMousePressed && !copied) {
                            var selectionStart = text.selectionStart, selectionEnd = text.selectionEnd, key = null, modifier = 0;
                            if (0 == selectionStart ? key = KEYS.up : 1 == selectionStart ? key = KEYS.home : selectionEnd > lastSelectionEnd && "\n" == lastValue[selectionEnd] ? key = KEYS.end : selectionStart < lastSelectionStart && " " == lastValue[selectionStart - 1] ? (key = KEYS.left, modifier = MODS.option) : selectionStart < lastSelectionStart || selectionStart == lastSelectionStart && lastSelectionEnd != lastSelectionStart && selectionStart == selectionEnd ? key = KEYS.left : selectionEnd > lastSelectionEnd && lastValue.slice(0, selectionEnd).split("\n").length > 2 ? key = KEYS.down : selectionEnd > lastSelectionEnd && " " == lastValue[selectionEnd - 1] ? (key = KEYS.right, modifier = MODS.option) : (selectionEnd > lastSelectionEnd || selectionEnd == lastSelectionEnd && lastSelectionEnd != lastSelectionStart && selectionStart == selectionEnd) && (key = KEYS.right), selectionStart !== selectionEnd && (modifier |= MODS.shift), key) {
                                if (!host.onCommandKey({}, modifier, key) && host.commands) {
                                    key = KEYS.keyCodeToString(key);
                                    var command = host.commands.findKeyCommand(modifier, key);
                                    command && host.execCommand(command);
                                }
                                lastSelectionStart = selectionStart, lastSelectionEnd = selectionEnd, resetSelection("");
                            }
                        }
                    }, document.addEventListener("selectionchange", detectArrowKeys), host.on("destroy", function() {
                        document.removeEventListener("selectionchange", detectArrowKeys);
                    }));
                }, exports.$setUserAgentForTests = function(_isMobile, _isIOS) {
                    isMobile = _isMobile, isIOS = _isIOS;
                };
            }), ace.define("ace/mouse/default_handlers", [
                "require",
                "exports",
                "module",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var useragent = require("../lib/useragent");
                function DefaultHandlers(mouseHandler) {
                    mouseHandler.$clickSelection = null;
                    var editor = mouseHandler.editor;
                    editor.setDefaultHandler("mousedown", this.onMouseDown.bind(mouseHandler)), editor.setDefaultHandler("dblclick", this.onDoubleClick.bind(mouseHandler)), editor.setDefaultHandler("tripleclick", this.onTripleClick.bind(mouseHandler)), editor.setDefaultHandler("quadclick", this.onQuadClick.bind(mouseHandler)), editor.setDefaultHandler("mousewheel", this.onMouseWheel.bind(mouseHandler)), [
                        "select",
                        "startSelect",
                        "selectEnd",
                        "selectAllEnd",
                        "selectByWordsEnd",
                        "selectByLinesEnd",
                        "dragWait",
                        "dragWaitEnd",
                        "focusWait"
                    ].forEach(function(x) {
                        mouseHandler[x] = this[x];
                    }, this), mouseHandler.selectByLines = this.extendSelectionBy.bind(mouseHandler, "getLineRange"), mouseHandler.selectByWords = this.extendSelectionBy.bind(mouseHandler, "getWordRange");
                }
                function calcRangeOrientation(range, cursor) {
                    if (range.start.row == range.end.row) var cmp = 2 * cursor.column - range.start.column - range.end.column;
                    else if (range.start.row != range.end.row - 1 || range.start.column || range.end.column) var cmp = 2 * cursor.row - range.start.row - range.end.row;
                    else var cmp = cursor.column - 4;
                    return cmp < 0 ? {
                        cursor: range.start,
                        anchor: range.end
                    } : {
                        cursor: range.end,
                        anchor: range.start
                    };
                }
                (function() {
                    this.onMouseDown = function(ev) {
                        var inSelection = ev.inSelection(), pos = ev.getDocumentPosition();
                        this.mousedownEvent = ev;
                        var editor = this.editor, button = ev.getButton();
                        if (0 !== button) {
                            (editor.getSelectionRange().isEmpty() || 1 == button) && editor.selection.moveToPosition(pos), 2 != button || (editor.textInput.onContextMenu(ev.domEvent), useragent.isMozilla || ev.preventDefault());
                            return;
                        }
                        if (this.mousedownEvent.time = Date.now(), inSelection && !editor.isFocused() && (editor.focus(), this.$focusTimeout && !this.$clickSelection && !editor.inMultiSelectMode)) {
                            this.setState("focusWait"), this.captureMouse(ev);
                            return;
                        }
                        return this.captureMouse(ev), this.startSelect(pos, ev.domEvent._clicks > 1), ev.preventDefault();
                    }, this.startSelect = function(pos, waitForClickSelection) {
                        pos = pos || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
                        var editor = this.editor;
                        this.mousedownEvent && (this.mousedownEvent.getShiftKey() ? editor.selection.selectToPosition(pos) : waitForClickSelection || editor.selection.moveToPosition(pos), waitForClickSelection || this.select(), editor.renderer.scroller.setCapture && editor.renderer.scroller.setCapture(), editor.setStyle("ace_selecting"), this.setState("select"));
                    }, this.select = function() {
                        var anchor, editor = this.editor, cursor = editor.renderer.screenToTextCoordinates(this.x, this.y);
                        if (this.$clickSelection) {
                            var cmp = this.$clickSelection.comparePoint(cursor);
                            if (-1 == cmp) anchor = this.$clickSelection.end;
                            else if (1 == cmp) anchor = this.$clickSelection.start;
                            else {
                                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                                cursor = orientedRange.cursor, anchor = orientedRange.anchor;
                            }
                            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
                        }
                        editor.selection.selectToPosition(cursor), editor.renderer.scrollCursorIntoView();
                    }, this.extendSelectionBy = function(unitName) {
                        var anchor, editor = this.editor, cursor = editor.renderer.screenToTextCoordinates(this.x, this.y), range = editor.selection[unitName](cursor.row, cursor.column);
                        if (this.$clickSelection) {
                            var cmpStart = this.$clickSelection.comparePoint(range.start), cmpEnd = this.$clickSelection.comparePoint(range.end);
                            if (-1 == cmpStart && cmpEnd <= 0) anchor = this.$clickSelection.end, (range.end.row != cursor.row || range.end.column != cursor.column) && (cursor = range.start);
                            else if (1 == cmpEnd && cmpStart >= 0) anchor = this.$clickSelection.start, (range.start.row != cursor.row || range.start.column != cursor.column) && (cursor = range.end);
                            else if (-1 == cmpStart && 1 == cmpEnd) cursor = range.end, anchor = range.start;
                            else {
                                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                                cursor = orientedRange.cursor, anchor = orientedRange.anchor;
                            }
                            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
                        }
                        editor.selection.selectToPosition(cursor), editor.renderer.scrollCursorIntoView();
                    }, this.selectEnd = this.selectAllEnd = this.selectByWordsEnd = this.selectByLinesEnd = function() {
                        this.$clickSelection = null, this.editor.unsetStyle("ace_selecting"), this.editor.renderer.scroller.releaseCapture && this.editor.renderer.scroller.releaseCapture();
                    }, this.focusWait = function() {
                        var ax, ay, distance = (ax = this.mousedownEvent.x, ay = this.mousedownEvent.y, Math.sqrt(Math.pow(this.x - ax, 2) + Math.pow(this.y - ay, 2))), time = Date.now();
                        (distance > 0 || time - this.mousedownEvent.time > this.$focusTimeout) && this.startSelect(this.mousedownEvent.getDocumentPosition());
                    }, this.onDoubleClick = function(ev) {
                        var pos = ev.getDocumentPosition(), editor = this.editor, range = editor.session.getBracketRange(pos);
                        range ? (range.isEmpty() && (range.start.column--, range.end.column++), this.setState("select")) : (range = editor.selection.getWordRange(pos.row, pos.column), this.setState("selectByWords")), this.$clickSelection = range, this.select();
                    }, this.onTripleClick = function(ev) {
                        var pos = ev.getDocumentPosition(), editor = this.editor;
                        this.setState("selectByLines");
                        var range = editor.getSelectionRange();
                        range.isMultiLine() && range.contains(pos.row, pos.column) ? (this.$clickSelection = editor.selection.getLineRange(range.start.row), this.$clickSelection.end = editor.selection.getLineRange(range.end.row).end) : this.$clickSelection = editor.selection.getLineRange(pos.row), this.select();
                    }, this.onQuadClick = function(ev) {
                        var editor = this.editor;
                        editor.selectAll(), this.$clickSelection = editor.getSelectionRange(), this.setState("selectAll");
                    }, this.onMouseWheel = function(ev) {
                        if (!ev.getAccelKey()) {
                            ev.getShiftKey() && ev.wheelY && !ev.wheelX && (ev.wheelX = ev.wheelY, ev.wheelY = 0);
                            var editor = this.editor;
                            this.$lastScroll || (this.$lastScroll = {
                                t: 0,
                                vx: 0,
                                vy: 0,
                                allowed: 0
                            });
                            var prevScroll = this.$lastScroll, t = ev.domEvent.timeStamp, dt = t - prevScroll.t, vx = dt ? ev.wheelX / dt : prevScroll.vx, vy = dt ? ev.wheelY / dt : prevScroll.vy;
                            dt < 550 && (vx = (vx + prevScroll.vx) / 2, vy = (vy + prevScroll.vy) / 2);
                            var direction = Math.abs(vx / vy), canScroll = !1;
                            if (direction >= 1 && editor.renderer.isScrollableBy(ev.wheelX * ev.speed, 0) && (canScroll = !0), direction <= 1 && editor.renderer.isScrollableBy(0, ev.wheelY * ev.speed) && (canScroll = !0), canScroll ? prevScroll.allowed = t : t - prevScroll.allowed < 550 && (Math.abs(vx) <= 1.5 * Math.abs(prevScroll.vx) && Math.abs(vy) <= 1.5 * Math.abs(prevScroll.vy) ? (canScroll = !0, prevScroll.allowed = t) : prevScroll.allowed = 0), prevScroll.t = t, prevScroll.vx = vx, prevScroll.vy = vy, canScroll) return editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed), ev.stop();
                        }
                    };
                }).call(DefaultHandlers.prototype), exports.DefaultHandlers = DefaultHandlers;
            }), ace.define("ace/tooltip", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                require("./lib/oop");
                var dom = require("./lib/dom");
                function Tooltip(parentNode) {
                    this.isOpen = !1, this.$element = null, this.$parentNode = parentNode;
                }
                (function() {
                    this.$init = function() {
                        return this.$element = dom.createElement("div"), this.$element.className = "ace_tooltip", this.$element.style.display = "none", this.$parentNode.appendChild(this.$element), this.$element;
                    }, this.getElement = function() {
                        return this.$element || this.$init();
                    }, this.setText = function(text) {
                        this.getElement().textContent = text;
                    }, this.setHtml = function(html) {
                        this.getElement().innerHTML = html;
                    }, this.setPosition = function(x, y) {
                        this.getElement().style.left = x + "px", this.getElement().style.top = y + "px";
                    }, this.setClassName = function(className) {
                        dom.addCssClass(this.getElement(), className);
                    }, this.show = function(text, x, y) {
                        null != text && this.setText(text), null != x && null != y && this.setPosition(x, y), this.isOpen || (this.getElement().style.display = "block", this.isOpen = !0);
                    }, this.hide = function() {
                        this.isOpen && (this.getElement().style.display = "none", this.isOpen = !1);
                    }, this.getHeight = function() {
                        return this.getElement().offsetHeight;
                    }, this.getWidth = function() {
                        return this.getElement().offsetWidth;
                    }, this.destroy = function() {
                        this.isOpen = !1, this.$element && this.$element.parentNode && this.$element.parentNode.removeChild(this.$element);
                    };
                }).call(Tooltip.prototype), exports.Tooltip = Tooltip;
            }), ace.define("ace/mouse/default_gutter_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/event",
                "ace/tooltip"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom"), oop = require("../lib/oop"), event = require("../lib/event"), Tooltip = require("../tooltip").Tooltip;
                function GutterTooltip(parentNode) {
                    Tooltip.call(this, parentNode);
                }
                oop.inherits(GutterTooltip, Tooltip), (function() {
                    this.setPosition = function(x, y) {
                        var windowWidth = window.innerWidth || document.documentElement.clientWidth, windowHeight = window.innerHeight || document.documentElement.clientHeight, width = this.getWidth(), height = this.getHeight();
                        y += 15, (x += 15) + width > windowWidth && (x -= x + width - windowWidth), y + height > windowHeight && (y -= 20 + height), Tooltip.prototype.setPosition.call(this, x, y);
                    };
                }).call(GutterTooltip.prototype), exports.GutterHandler = function(mouseHandler) {
                    var tooltipTimeout, mouseEvent, tooltipAnnotation, editor = mouseHandler.editor, gutter = editor.renderer.$gutterLayer, tooltip = new GutterTooltip(editor.container);
                    function hideTooltip() {
                        tooltipTimeout && (tooltipTimeout = clearTimeout(tooltipTimeout)), tooltipAnnotation && (tooltip.hide(), tooltipAnnotation = null, editor._signal("hideGutterTooltip", tooltip), editor.off("mousewheel", hideTooltip));
                    }
                    function moveTooltip(e) {
                        tooltip.setPosition(e.x, e.y);
                    }
                    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
                        if (editor.isFocused() && 0 == e.getButton() && "foldWidgets" != gutter.getRegion(e)) {
                            var row = e.getDocumentPosition().row, selection = editor.session.selection;
                            if (e.getShiftKey()) selection.selectTo(row, 0);
                            else {
                                if (2 == e.domEvent.detail) return editor.selectAll(), e.preventDefault();
                                mouseHandler.$clickSelection = editor.selection.getLineRange(row);
                            }
                            return mouseHandler.setState("selectByLines"), mouseHandler.captureMouse(e), e.preventDefault();
                        }
                    }), mouseHandler.editor.setDefaultHandler("guttermousemove", function(e) {
                        var target = e.domEvent.target || e.domEvent.srcElement;
                        if (dom.hasCssClass(target, "ace_fold-widget")) return hideTooltip();
                        tooltipAnnotation && mouseHandler.$tooltipFollowsMouse && moveTooltip(e), mouseEvent = e, tooltipTimeout || (tooltipTimeout = setTimeout(function() {
                            tooltipTimeout = null, mouseEvent && !mouseHandler.isMousePressed ? function() {
                                var row = mouseEvent.getDocumentPosition().row, annotation = gutter.$annotations[row];
                                if (!annotation) return hideTooltip();
                                if (row == editor.session.getLength()) {
                                    var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row, pos = mouseEvent.$pos;
                                    if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column)) return hideTooltip();
                                }
                                if (tooltipAnnotation != annotation) {
                                    if (tooltipAnnotation = annotation.text.join("<br/>"), tooltip.setHtml(tooltipAnnotation), tooltip.show(), editor._signal("showGutterTooltip", tooltip), editor.on("mousewheel", hideTooltip), mouseHandler.$tooltipFollowsMouse) moveTooltip(mouseEvent);
                                    else {
                                        var rect = mouseEvent.domEvent.target.getBoundingClientRect(), style = tooltip.getElement().style;
                                        style.left = rect.right + "px", style.top = rect.bottom + "px";
                                    }
                                }
                            }() : hideTooltip();
                        }, 50));
                    }), event.addListener(editor.renderer.$gutter, "mouseout", function(e) {
                        mouseEvent = null, tooltipAnnotation && !tooltipTimeout && (tooltipTimeout = setTimeout(function() {
                            tooltipTimeout = null, hideTooltip();
                        }, 50));
                    }, editor), editor.on("changeSession", hideTooltip);
                };
            }), ace.define("ace/mouse/mouse_event", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var event = require("../lib/event"), useragent = require("../lib/useragent");
                (function() {
                    this.stopPropagation = function() {
                        event.stopPropagation(this.domEvent), this.propagationStopped = !0;
                    }, this.preventDefault = function() {
                        event.preventDefault(this.domEvent), this.defaultPrevented = !0;
                    }, this.stop = function() {
                        this.stopPropagation(), this.preventDefault();
                    }, this.getDocumentPosition = function() {
                        return this.$pos || (this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY)), this.$pos;
                    }, this.inSelection = function() {
                        if (null !== this.$inSelection) return this.$inSelection;
                        var selectionRange = this.editor.getSelectionRange();
                        if (selectionRange.isEmpty()) this.$inSelection = !1;
                        else {
                            var pos = this.getDocumentPosition();
                            this.$inSelection = selectionRange.contains(pos.row, pos.column);
                        }
                        return this.$inSelection;
                    }, this.getButton = function() {
                        return event.getButton(this.domEvent);
                    }, this.getShiftKey = function() {
                        return this.domEvent.shiftKey;
                    }, this.getAccelKey = useragent.isMac ? function() {
                        return this.domEvent.metaKey;
                    } : function() {
                        return this.domEvent.ctrlKey;
                    };
                }).call((exports.MouseEvent = function(domEvent, editor) {
                    this.domEvent = domEvent, this.editor = editor, this.x = this.clientX = domEvent.clientX, this.y = this.clientY = domEvent.clientY, this.$pos = null, this.$inSelection = null, this.propagationStopped = !1, this.defaultPrevented = !1;
                }).prototype);
            }), ace.define("ace/mouse/dragdrop_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom"), event = require("../lib/event"), useragent = require("../lib/useragent");
                function DragdropHandler(mouseHandler) {
                    var dragOperation, isInternal, autoScrollStartTime, cursorMovedTime, cursorPointOnCaretMoved, editor = mouseHandler.editor, dragImage = dom.createElement("div");
                    dragImage.style.cssText = "top:-100px;position:absolute;z-index:2147483647;opacity:0.5", dragImage.textContent = "\xa0", [
                        "dragWait",
                        "dragWaitEnd",
                        "startDrag",
                        "dragReadyEnd",
                        "onMouseDrag"
                    ].forEach(function(x) {
                        mouseHandler[x] = this[x];
                    }, this), editor.on("mousedown", this.onMouseDown.bind(mouseHandler));
                    var dragSelectionMarker, x, y, timerId, range, dragCursor, mouseTarget = editor.container, counter = 0;
                    function onDragInterval() {
                        var cursor, now, vMovement, hMovement, cursor1, now1, lineHeight, characterWidth, editorRect, offsets, nearestXOffset, nearestYOffset, scrollCursor, vScroll, hScroll, vMovement1, prevCursor = dragCursor;
                        cursor = dragCursor = editor.renderer.screenToTextCoordinates(x, y), now = Date.now(), vMovement = !prevCursor || cursor.row != prevCursor.row, hMovement = !prevCursor || cursor.column != prevCursor.column, !cursorMovedTime || vMovement || hMovement ? (editor.moveCursorToPosition(cursor), cursorMovedTime = now, cursorPointOnCaretMoved = {
                            x: x,
                            y: y
                        }) : calcDistance(cursorPointOnCaretMoved.x, cursorPointOnCaretMoved.y, x, y) > 5 ? cursorMovedTime = null : now - cursorMovedTime >= 200 && (editor.renderer.scrollCursorIntoView(), cursorMovedTime = null), cursor1 = dragCursor, now1 = Date.now(), lineHeight = editor.renderer.layerConfig.lineHeight, characterWidth = editor.renderer.layerConfig.characterWidth, editorRect = editor.renderer.scroller.getBoundingClientRect(), nearestXOffset = Math.min((offsets = {
                            x: {
                                left: x - editorRect.left,
                                right: editorRect.right - x
                            },
                            y: {
                                top: y - editorRect.top,
                                bottom: editorRect.bottom - y
                            }
                        }).x.left, offsets.x.right), nearestYOffset = Math.min(offsets.y.top, offsets.y.bottom), scrollCursor = {
                            row: cursor1.row,
                            column: cursor1.column
                        }, nearestXOffset / characterWidth <= 2 && (scrollCursor.column += offsets.x.left < offsets.x.right ? -3 : 2), nearestYOffset / lineHeight <= 1 && (scrollCursor.row += offsets.y.top < offsets.y.bottom ? -1 : 1), vScroll = cursor1.row != scrollCursor.row, hScroll = cursor1.column != scrollCursor.column, vMovement1 = !prevCursor || cursor1.row != prevCursor.row, vScroll || hScroll && !vMovement1 ? autoScrollStartTime ? now1 - autoScrollStartTime >= 200 && editor.renderer.scrollCursorIntoView(scrollCursor) : autoScrollStartTime = now1 : autoScrollStartTime = null;
                    }
                    function addDragMarker() {
                        range = editor.selection.toOrientedRange(), dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle()), editor.clearSelection(), editor.isFocused() && editor.renderer.$cursorLayer.setBlinking(!1), clearInterval(timerId), onDragInterval(), timerId = setInterval(onDragInterval, 20), counter = 0, event.addListener(document, "mousemove", onMouseMove);
                    }
                    function clearDragMarker() {
                        clearInterval(timerId), editor.session.removeMarker(dragSelectionMarker), dragSelectionMarker = null, editor.selection.fromOrientedRange(range), editor.isFocused() && !isInternal && editor.$resetCursorStyle(), range = null, dragCursor = null, counter = 0, autoScrollStartTime = null, cursorMovedTime = null, event.removeListener(document, "mousemove", onMouseMove);
                    }
                    this.onDragStart = function(e) {
                        if (this.cancelDrag || !mouseTarget.draggable) {
                            var self1 = this;
                            return setTimeout(function() {
                                self1.startSelect(), self1.captureMouse(e);
                            }, 0), e.preventDefault();
                        }
                        range = editor.getSelectionRange();
                        var dataTransfer = e.dataTransfer;
                        dataTransfer.effectAllowed = editor.getReadOnly() ? "copy" : "copyMove", editor.container.appendChild(dragImage), dataTransfer.setDragImage && dataTransfer.setDragImage(dragImage, 0, 0), setTimeout(function() {
                            editor.container.removeChild(dragImage);
                        }), dataTransfer.clearData(), dataTransfer.setData("Text", editor.session.getTextRange()), isInternal = !0, this.setState("drag");
                    }, this.onDragEnd = function(e) {
                        if (mouseTarget.draggable = !1, isInternal = !1, this.setState(null), !editor.getReadOnly()) {
                            var dropEffect = e.dataTransfer.dropEffect;
                            dragOperation || "move" != dropEffect || editor.session.remove(editor.getSelectionRange()), editor.$resetCursorStyle();
                        }
                        this.editor.unsetStyle("ace_dragging"), this.editor.renderer.setCursorStyle("");
                    }, this.onDragEnter = function(e) {
                        if (!editor.getReadOnly() && canAccept(e.dataTransfer)) return x = e.clientX, y = e.clientY, dragSelectionMarker || addDragMarker(), counter++, e.dataTransfer.dropEffect = dragOperation = getDropEffect(e), event.preventDefault(e);
                    }, this.onDragOver = function(e) {
                        if (!editor.getReadOnly() && canAccept(e.dataTransfer)) return x = e.clientX, y = e.clientY, !dragSelectionMarker && (addDragMarker(), counter++), null !== onMouseMoveTimer && (onMouseMoveTimer = null), e.dataTransfer.dropEffect = dragOperation = getDropEffect(e), event.preventDefault(e);
                    }, this.onDragLeave = function(e) {
                        if (--counter <= 0 && dragSelectionMarker) return clearDragMarker(), dragOperation = null, event.preventDefault(e);
                    }, this.onDrop = function(e) {
                        if (dragCursor) {
                            var dataTransfer = e.dataTransfer;
                            if (isInternal) switch(dragOperation){
                                case "move":
                                    range = range.contains(dragCursor.row, dragCursor.column) ? {
                                        start: dragCursor,
                                        end: dragCursor
                                    } : editor.moveText(range, dragCursor);
                                    break;
                                case "copy":
                                    range = editor.moveText(range, dragCursor, !0);
                            }
                            else {
                                var dropData = dataTransfer.getData("Text");
                                range = {
                                    start: dragCursor,
                                    end: editor.session.insert(dragCursor, dropData)
                                }, editor.focus(), dragOperation = null;
                            }
                            return clearDragMarker(), event.preventDefault(e);
                        }
                    }, event.addListener(mouseTarget, "dragstart", this.onDragStart.bind(mouseHandler), editor), event.addListener(mouseTarget, "dragend", this.onDragEnd.bind(mouseHandler), editor), event.addListener(mouseTarget, "dragenter", this.onDragEnter.bind(mouseHandler), editor), event.addListener(mouseTarget, "dragover", this.onDragOver.bind(mouseHandler), editor), event.addListener(mouseTarget, "dragleave", this.onDragLeave.bind(mouseHandler), editor), event.addListener(mouseTarget, "drop", this.onDrop.bind(mouseHandler), editor);
                    var onMouseMoveTimer = null;
                    function onMouseMove() {
                        null == onMouseMoveTimer && (onMouseMoveTimer = setTimeout(function() {
                            null != onMouseMoveTimer && dragSelectionMarker && clearDragMarker();
                        }, 20));
                    }
                    function canAccept(dataTransfer) {
                        var types = dataTransfer.types;
                        return !types || Array.prototype.some.call(types, function(type) {
                            return "text/plain" == type || "Text" == type;
                        });
                    }
                    function getDropEffect(e) {
                        var copyAllowed = [
                            "copy",
                            "copymove",
                            "all",
                            "uninitialized"
                        ], copyModifierState = useragent.isMac ? e.altKey : e.ctrlKey, effectAllowed = "uninitialized";
                        try {
                            effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
                        } catch (e) {}
                        var dropEffect = "none";
                        return copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0 ? dropEffect = "copy" : [
                            "move",
                            "copymove",
                            "linkmove",
                            "all",
                            "uninitialized"
                        ].indexOf(effectAllowed) >= 0 ? dropEffect = "move" : copyAllowed.indexOf(effectAllowed) >= 0 && (dropEffect = "copy"), dropEffect;
                    }
                }
                function calcDistance(ax, ay, bx, by) {
                    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
                }
                (function() {
                    this.dragWait = function() {
                        Date.now() - this.mousedownEvent.time > this.editor.getDragDelay() && this.startDrag();
                    }, this.dragWaitEnd = function() {
                        this.editor.container.draggable = !1, this.startSelect(this.mousedownEvent.getDocumentPosition()), this.selectEnd();
                    }, this.dragReadyEnd = function(e) {
                        this.editor.$resetCursorStyle(), this.editor.unsetStyle("ace_dragging"), this.editor.renderer.setCursorStyle(""), this.dragWaitEnd();
                    }, this.startDrag = function() {
                        this.cancelDrag = !1;
                        var editor = this.editor;
                        editor.container.draggable = !0, editor.renderer.$cursorLayer.setBlinking(!1), editor.setStyle("ace_dragging");
                        var cursorStyle = useragent.isWin ? "default" : "move";
                        editor.renderer.setCursorStyle(cursorStyle), this.setState("dragReady");
                    }, this.onMouseDrag = function(e) {
                        var target = this.editor.container;
                        if (useragent.isIE && "dragReady" == this.state) {
                            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            distance > 3 && target.dragDrop();
                        }
                        if ("dragWait" === this.state) {
                            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
                            distance > 0 && (target.draggable = !1, this.startSelect(this.mousedownEvent.getDocumentPosition()));
                        }
                    }, this.onMouseDown = function(e) {
                        if (this.$dragEnabled) {
                            this.mousedownEvent = e;
                            var editor = this.editor, inSelection = e.inSelection(), button = e.getButton();
                            if (1 === (e.domEvent.detail || 1) && 0 === button && inSelection) {
                                if (e.editor.inMultiSelectMode && (e.getAccelKey() || e.getShiftKey())) return;
                                this.mousedownEvent.time = Date.now();
                                var eventTarget = e.domEvent.target || e.domEvent.srcElement;
                                "unselectable" in eventTarget && (eventTarget.unselectable = "on"), editor.getDragDelay() ? (useragent.isWebKit && (this.cancelDrag = !0, editor.container.draggable = !0), this.setState("dragWait")) : this.startDrag(), this.captureMouse(e, this.onMouseDrag.bind(this)), e.defaultPrevented = !0;
                            }
                        }
                    };
                }).call(DragdropHandler.prototype), exports.DragdropHandler = DragdropHandler;
            }), ace.define("ace/mouse/touch_handler", [
                "require",
                "exports",
                "module",
                "ace/mouse/mouse_event",
                "ace/lib/event",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var MouseEvent = require("./mouse_event").MouseEvent, event = require("../lib/event"), dom = require("../lib/dom");
                exports.addTouchListeners = function(el, editor) {
                    var startX, startY, touchStartT, lastT, longTouchTimer, animationTimer, pos, pressed, contextMenu, mode = "scroll", animationSteps = 0, clickCount = 0, vX = 0, vY = 0;
                    function showContextMenu() {
                        if (!contextMenu) {
                            var clipboard, isOpen, updateMenu, handleClick;
                            clipboard = window.navigator && window.navigator.clipboard, isOpen = !1, updateMenu = function() {
                                var selected = editor.getCopyText(), hasUndo = editor.session.getUndoManager().hasUndo();
                                contextMenu.replaceChild(dom.buildDom(isOpen ? [
                                    "span",
                                    !selected && [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "selectall"
                                        },
                                        "Select All"
                                    ],
                                    selected && [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "copy"
                                        },
                                        "Copy"
                                    ],
                                    selected && [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "cut"
                                        },
                                        "Cut"
                                    ],
                                    clipboard && [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "paste"
                                        },
                                        "Paste"
                                    ],
                                    hasUndo && [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "undo"
                                        },
                                        "Undo"
                                    ],
                                    [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "find"
                                        },
                                        "Find"
                                    ],
                                    [
                                        "span",
                                        {
                                            class: "ace_mobile-button",
                                            action: "openCommandPallete"
                                        },
                                        "Pallete"
                                    ]
                                ] : [
                                    "span"
                                ]), contextMenu.firstChild);
                            }, handleClick = function(e) {
                                var action = e.target.getAttribute("action");
                                if ("more" == action || !isOpen) return isOpen = !isOpen, updateMenu();
                                "paste" == action ? clipboard.readText().then(function(text) {
                                    editor.execCommand(action, text);
                                }) : action && (("cut" == action || "copy" == action) && (clipboard ? clipboard.writeText(editor.getCopyText()) : document.execCommand("copy")), editor.execCommand(action)), contextMenu.firstChild.style.display = "none", isOpen = !1, "openCommandPallete" != action && editor.focus();
                            }, contextMenu = dom.buildDom([
                                "div",
                                {
                                    class: "ace_mobile-menu",
                                    ontouchstart: function(e) {
                                        mode = "menu", e.stopPropagation(), e.preventDefault(), editor.textInput.focus();
                                    },
                                    ontouchend: function(e) {
                                        e.stopPropagation(), e.preventDefault(), handleClick(e);
                                    },
                                    onclick: handleClick
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
                                    "..."
                                ]
                            ], editor.container);
                        }
                        var cursor = editor.selection.cursor, pagePos = editor.renderer.textToScreenCoordinates(cursor.row, cursor.column), leftOffset = editor.renderer.textToScreenCoordinates(0, 0).pageX, scrollLeft = editor.renderer.scrollLeft, rect = editor.container.getBoundingClientRect();
                        contextMenu.style.top = pagePos.pageY - rect.top - 3 + "px", pagePos.pageX - rect.left < rect.width - 70 ? (contextMenu.style.left = "", contextMenu.style.right = "10px") : (contextMenu.style.right = "", contextMenu.style.left = leftOffset + scrollLeft - rect.left + "px"), contextMenu.style.display = "", contextMenu.firstChild.style.display = "none", editor.on("input", hideContextMenu);
                    }
                    function hideContextMenu(e) {
                        contextMenu && (contextMenu.style.display = "none"), editor.off("input", hideContextMenu);
                    }
                    function handleLongTap() {
                        clearTimeout(longTouchTimer = null);
                        var range = editor.selection.getRange(), inSelection = range.contains(pos.row, pos.column);
                        (range.isEmpty() || !inSelection) && (editor.selection.moveToPosition(pos), editor.selection.selectWord()), mode = "wait", showContextMenu();
                    }
                    event.addListener(el, "contextmenu", function(e) {
                        pressed && editor.textInput.getElement().focus();
                    }, editor), event.addListener(el, "touchstart", function(e) {
                        var range, touches = e.touches;
                        if (longTouchTimer || touches.length > 1) {
                            clearTimeout(longTouchTimer), longTouchTimer = null, touchStartT = -1, mode = "zoom";
                            return;
                        }
                        pressed = editor.$mouseHandler.isMousePressed = !0;
                        var h = editor.renderer.layerConfig.lineHeight, w = editor.renderer.layerConfig.lineHeight, t = e.timeStamp;
                        lastT = t;
                        var touchObj = touches[0], x = touchObj.clientX, y = touchObj.clientY;
                        if (Math.abs(startX - x) + Math.abs(startY - y) > h && (touchStartT = -1), startX = e.clientX = x, startY = e.clientY = y, vX = vY = 0, pos = new MouseEvent(e, editor).getDocumentPosition(), t - touchStartT < 500 && 1 == touches.length && !animationSteps) clickCount++, e.preventDefault(), e.button = 0, clearTimeout(longTouchTimer = null), editor.selection.moveToPosition(pos), (range = clickCount >= 2 ? editor.selection.getLineRange(pos.row) : editor.session.getBracketRange(pos)) && !range.isEmpty() ? editor.selection.setRange(range) : editor.selection.selectWord(), mode = "wait";
                        else {
                            clickCount = 0;
                            var cursor = editor.selection.cursor, anchor = editor.selection.isEmpty() ? cursor : editor.selection.anchor, cursorPos = editor.renderer.$cursorLayer.getPixelPosition(cursor, !0), anchorPos = editor.renderer.$cursorLayer.getPixelPosition(anchor, !0), rect = editor.renderer.scroller.getBoundingClientRect(), offsetTop = editor.renderer.layerConfig.offset, offsetLeft = editor.renderer.scrollLeft, weightedDistance = function(x, y) {
                                return (x /= w) * x + (y = y / h - 0.75) * y;
                            };
                            if (e.clientX < rect.left) {
                                mode = "zoom";
                                return;
                            }
                            var diff1 = weightedDistance(e.clientX - rect.left - cursorPos.left + offsetLeft, e.clientY - rect.top - cursorPos.top + offsetTop), diff2 = weightedDistance(e.clientX - rect.left - anchorPos.left + offsetLeft, e.clientY - rect.top - anchorPos.top + offsetTop);
                            diff1 < 3.5 && diff2 < 3.5 && (mode = diff1 > diff2 ? "cursor" : "anchor"), mode = diff2 < 3.5 ? "anchor" : diff1 < 3.5 ? "cursor" : "scroll", longTouchTimer = setTimeout(handleLongTap, 450);
                        }
                        touchStartT = t;
                    }, editor), event.addListener(el, "touchend", function(e) {
                        pressed = editor.$mouseHandler.isMousePressed = !1, animationTimer && clearInterval(animationTimer), "zoom" == mode ? (mode = "", animationSteps = 0) : longTouchTimer ? (editor.selection.moveToPosition(pos), animationSteps = 0, showContextMenu()) : "scroll" == mode ? (animationSteps += 60, animationTimer = setInterval(function() {
                            animationSteps-- <= 0 && (clearInterval(animationTimer), animationTimer = null), 0.01 > Math.abs(vX) && (vX = 0), 0.01 > Math.abs(vY) && (vY = 0), animationSteps < 20 && (vX *= 0.9), animationSteps < 20 && (vY *= 0.9);
                            var oldScrollTop = editor.session.getScrollTop();
                            editor.renderer.scrollBy(10 * vX, 10 * vY), oldScrollTop == editor.session.getScrollTop() && (animationSteps = 0);
                        }, 10), hideContextMenu()) : showContextMenu(), clearTimeout(longTouchTimer), longTouchTimer = null;
                    }, editor), event.addListener(el, "touchmove", function(e) {
                        longTouchTimer && (clearTimeout(longTouchTimer), longTouchTimer = null);
                        var touches = e.touches;
                        if (!(touches.length > 1) && "zoom" != mode) {
                            var touchObj = touches[0], wheelX = startX - touchObj.clientX, wheelY = startY - touchObj.clientY;
                            if ("wait" == mode) {
                                if (!(wheelX * wheelX + wheelY * wheelY > 4)) return e.preventDefault();
                                mode = "cursor";
                            }
                            startX = touchObj.clientX, startY = touchObj.clientY, e.clientX = touchObj.clientX, e.clientY = touchObj.clientY;
                            var t = e.timeStamp, dt = t - lastT;
                            if (lastT = t, "scroll" == mode) {
                                var mouseEvent = new MouseEvent(e, editor);
                                mouseEvent.speed = 1, mouseEvent.wheelX = wheelX, mouseEvent.wheelY = wheelY, 10 * Math.abs(wheelX) < Math.abs(wheelY) && (wheelX = 0), 10 * Math.abs(wheelY) < Math.abs(wheelX) && (wheelY = 0), 0 != dt && (vX = wheelX / dt, vY = wheelY / dt), editor._emit("mousewheel", mouseEvent), mouseEvent.propagationStopped || (vX = vY = 0);
                            } else {
                                var pos = new MouseEvent(e, editor).getDocumentPosition();
                                "cursor" == mode ? editor.selection.moveCursorToPosition(pos) : "anchor" == mode && editor.selection.setSelectionAnchor(pos.row, pos.column), editor.renderer.scrollCursorIntoView(pos), e.preventDefault();
                            }
                        }
                    }, editor);
                };
            }), ace.define("ace/lib/net", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("./dom");
                exports.get = function(url, callback) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, !0), xhr.onreadystatechange = function() {
                        4 === xhr.readyState && callback(xhr.responseText);
                    }, xhr.send(null);
                }, exports.loadScript = function(path, callback) {
                    var head = dom.getDocumentHead(), s = document.createElement("script");
                    s.src = path, head.appendChild(s), s.onload = s.onreadystatechange = function(_, isAbort) {
                        !isAbort && s.readyState && "loaded" != s.readyState && "complete" != s.readyState || (s = s.onload = s.onreadystatechange = null, isAbort || callback());
                    };
                }, exports.qualifyURL = function(url) {
                    var a = document.createElement("a");
                    return a.href = url, a.href;
                };
            }), ace.define("ace/lib/event_emitter", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                var EventEmitter = {}, stopPropagation = function() {
                    this.propagationStopped = !0;
                }, preventDefault = function() {
                    this.defaultPrevented = !0;
                };
                EventEmitter._emit = EventEmitter._dispatchEvent = function(eventName, e) {
                    this._eventRegistry || (this._eventRegistry = {}), this._defaultHandlers || (this._defaultHandlers = {});
                    var listeners = this._eventRegistry[eventName] || [], defaultHandler = this._defaultHandlers[eventName];
                    if (listeners.length || defaultHandler) {
                        "object" == typeof e && e || (e = {}), e.type || (e.type = eventName), e.stopPropagation || (e.stopPropagation = stopPropagation), e.preventDefault || (e.preventDefault = preventDefault), listeners = listeners.slice();
                        for(var i = 0; i < listeners.length && (listeners[i](e, this), !e.propagationStopped); i++);
                        if (defaultHandler && !e.defaultPrevented) return defaultHandler(e, this);
                    }
                }, EventEmitter._signal = function(eventName, e) {
                    var listeners = (this._eventRegistry || {})[eventName];
                    if (listeners) {
                        listeners = listeners.slice();
                        for(var i = 0; i < listeners.length; i++)listeners[i](e, this);
                    }
                }, EventEmitter.once = function(eventName, callback) {
                    var _self = this;
                    if (this.on(eventName, function newCallback() {
                        _self.off(eventName, newCallback), callback.apply(null, arguments);
                    }), !callback) return new Promise(function(resolve) {
                        callback = resolve;
                    });
                }, EventEmitter.setDefaultHandler = function(eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (handlers || (handlers = this._defaultHandlers = {
                        _disabled_: {}
                    }), handlers[eventName]) {
                        var old = handlers[eventName], disabled = handlers._disabled_[eventName];
                        disabled || (handlers._disabled_[eventName] = disabled = []), disabled.push(old);
                        var i = disabled.indexOf(callback);
                        -1 != i && disabled.splice(i, 1);
                    }
                    handlers[eventName] = callback;
                }, EventEmitter.removeDefaultHandler = function(eventName, callback) {
                    var handlers = this._defaultHandlers;
                    if (handlers) {
                        var disabled = handlers._disabled_[eventName];
                        if (handlers[eventName] == callback) disabled && this.setDefaultHandler(eventName, disabled.pop());
                        else if (disabled) {
                            var i = disabled.indexOf(callback);
                            -1 != i && disabled.splice(i, 1);
                        }
                    }
                }, EventEmitter.on = EventEmitter.addEventListener = function(eventName, callback, capturing) {
                    this._eventRegistry = this._eventRegistry || {};
                    var listeners = this._eventRegistry[eventName];
                    return listeners || (listeners = this._eventRegistry[eventName] = []), -1 == listeners.indexOf(callback) && listeners[capturing ? "unshift" : "push"](callback), callback;
                }, EventEmitter.off = EventEmitter.removeListener = EventEmitter.removeEventListener = function(eventName, callback) {
                    this._eventRegistry = this._eventRegistry || {};
                    var listeners = this._eventRegistry[eventName];
                    if (listeners) {
                        var index = listeners.indexOf(callback);
                        -1 !== index && listeners.splice(index, 1);
                    }
                }, EventEmitter.removeAllListeners = function(eventName) {
                    eventName || (this._eventRegistry = this._defaultHandlers = void 0), this._eventRegistry && (this._eventRegistry[eventName] = void 0), this._defaultHandlers && (this._defaultHandlers[eventName] = void 0);
                }, exports.EventEmitter = EventEmitter;
            }), ace.define("ace/lib/app_config", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                var oop = require("./oop"), EventEmitter = require("./event_emitter").EventEmitter, optionsProvider = {
                    setOptions: function(optList) {
                        Object.keys(optList).forEach(function(key) {
                            this.setOption(key, optList[key]);
                        }, this);
                    },
                    getOptions: function(optionNames) {
                        var result = {};
                        if (optionNames) Array.isArray(optionNames) || (optionNames = Object.keys(result = optionNames));
                        else {
                            var options = this.$options;
                            optionNames = Object.keys(options).filter(function(key) {
                                return !options[key].hidden;
                            });
                        }
                        return optionNames.forEach(function(key) {
                            result[key] = this.getOption(key);
                        }, this), result;
                    },
                    setOption: function(name, value) {
                        if (this["$" + name] !== value) {
                            var opt = this.$options[name];
                            if (!opt) return warn('misspelled option "' + name + '"');
                            if (opt.forwardTo) return this[opt.forwardTo] && this[opt.forwardTo].setOption(name, value);
                            opt.handlesSet || (this["$" + name] = value), opt && opt.set && opt.set.call(this, value);
                        }
                    },
                    getOption: function(name) {
                        var opt = this.$options[name];
                        return opt ? opt.forwardTo ? this[opt.forwardTo] && this[opt.forwardTo].getOption(name) : opt && opt.get ? opt.get.call(this) : this["$" + name] : warn('misspelled option "' + name + '"');
                    }
                };
                function warn(message) {
                    "undefined" != typeof console && console.warn && console.warn.apply(console, arguments);
                }
                function reportError(msg, data) {
                    var e = Error(msg);
                    e.data = data, "object" == typeof console && console.error && console.error(e), setTimeout(function() {
                        throw e;
                    });
                }
                var AppConfig = function() {
                    this.$defaultOptions = {};
                };
                (function() {
                    oop.implement(this, EventEmitter), this.defineOptions = function(obj, path, options) {
                        return obj.$options || (this.$defaultOptions[path] = obj.$options = {}), Object.keys(options).forEach(function(key) {
                            var opt = options[key];
                            "string" == typeof opt && (opt = {
                                forwardTo: opt
                            }), opt.name || (opt.name = key), obj.$options[opt.name] = opt, "initialValue" in opt && (obj["$" + opt.name] = opt.initialValue);
                        }), oop.implement(obj, optionsProvider), this;
                    }, this.resetOptions = function(obj) {
                        Object.keys(obj.$options).forEach(function(key) {
                            var opt = obj.$options[key];
                            "value" in opt && obj.setOption(key, opt.value);
                        });
                    }, this.setDefaultValue = function(path, name, value) {
                        if (!path) {
                            for(path in this.$defaultOptions)if (this.$defaultOptions[path][name]) break;
                            if (!this.$defaultOptions[path][name]) return !1;
                        }
                        var opts = this.$defaultOptions[path] || (this.$defaultOptions[path] = {});
                        opts[name] && (opts.forwardTo ? this.setDefaultValue(opts.forwardTo, name, value) : opts[name].value = value);
                    }, this.setDefaultValues = function(path, optionHash) {
                        Object.keys(optionHash).forEach(function(key) {
                            this.setDefaultValue(path, key, optionHash[key]);
                        }, this);
                    }, this.warn = warn, this.reportError = reportError;
                }).call(AppConfig.prototype), exports.AppConfig = AppConfig;
            }), ace.define("ace/config", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/dom",
                "ace/lib/app_config"
            ], function(require, exports, module) {
                var lang = require("./lib/lang");
                require("./lib/oop");
                var net = require("./lib/net"), dom = require("./lib/dom"), AppConfig = require("./lib/app_config").AppConfig;
                module.exports = exports = new AppConfig();
                var global = function() {
                    return this || "undefined" != typeof window && window;
                }(), options = {
                    packaged: !1,
                    workerPath: null,
                    modePath: null,
                    themePath: null,
                    basePath: "",
                    suffix: ".js",
                    $moduleUrls: {},
                    loadWorkerFromBlob: !0,
                    sharedPopups: !1,
                    useStrictCSP: null
                };
                exports.get = function(key) {
                    if (!options.hasOwnProperty(key)) throw Error("Unknown config key: " + key);
                    return options[key];
                }, exports.set = function(key, value) {
                    if (options.hasOwnProperty(key)) options[key] = value;
                    else if (!1 == this.setDefaultValue("", key, value)) throw Error("Unknown config key: " + key);
                    "useStrictCSP" == key && dom.useStrictCSP(value);
                }, exports.all = function() {
                    return lang.copyObject(options);
                }, exports.$modes = {}, exports.moduleUrl = function(name, component) {
                    if (options.$moduleUrls[name]) return options.$moduleUrls[name];
                    var parts = name.split("/"), sep = "snippets" == (component = component || parts[parts.length - 2] || "") ? "/" : "-", base = parts[parts.length - 1];
                    if ("worker" == component && "-" == sep) {
                        var re = RegExp("^" + component + "[\\-_]|[\\-_]" + component + "$", "g");
                        base = base.replace(re, "");
                    }
                    (!base || base == component) && parts.length > 1 && (base = parts[parts.length - 2]);
                    var path = options[component + "Path"];
                    return null == path ? path = options.basePath : "/" == sep && (component = sep = ""), path && "/" != path.slice(-1) && (path += "/"), path + component + sep + base + this.get("suffix");
                }, exports.setModuleUrl = function(name, subst) {
                    return options.$moduleUrls[name] = subst;
                }, exports.$loading = {}, exports.loadModule = function(moduleName, onLoad) {
                    Array.isArray(moduleName) && (moduleType = moduleName[0], moduleName = moduleName[1]);
                    try {
                        module = require(moduleName);
                    } catch (e) {}
                    if (module && !exports.$loading[moduleName]) return onLoad && onLoad(module);
                    if (exports.$loading[moduleName] || (exports.$loading[moduleName] = []), exports.$loading[moduleName].push(onLoad), !(exports.$loading[moduleName].length > 1)) {
                        var module, moduleType, afterLoad = function() {
                            require([
                                moduleName
                            ], function(module) {
                                exports._emit("load.module", {
                                    name: moduleName,
                                    module: module
                                });
                                var listeners = exports.$loading[moduleName];
                                exports.$loading[moduleName] = null, listeners.forEach(function(onLoad) {
                                    onLoad && onLoad(module);
                                });
                            });
                        };
                        if (!exports.get("packaged")) return afterLoad();
                        net.loadScript(exports.moduleUrl(moduleName, moduleType), afterLoad), reportErrorIfPathIsNotConfigured();
                    }
                };
                var reportErrorIfPathIsNotConfigured = function() {
                    options.basePath || options.workerPath || options.modePath || options.themePath || Object.keys(options.$moduleUrls).length || (console.error("Unable to infer path to ace from script src,", "use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes", "or with webpack use ace/webpack-resolver"), reportErrorIfPathIsNotConfigured = function() {});
                };
                function init(packaged) {
                    if (global && global.document) {
                        options.packaged = packaged || require.packaged || module.packaged || global.define && __webpack_require__.amdD.packaged;
                        for(var scriptOptions = {}, scriptUrl = "", currentScript = document.currentScript || document._currentScript, scripts = (currentScript && currentScript.ownerDocument || document).getElementsByTagName("script"), i = 0; i < scripts.length; i++){
                            var script = scripts[i], src = script.src || script.getAttribute("src");
                            if (src) {
                                for(var attributes = script.attributes, j = 0, l = attributes.length; j < l; j++){
                                    var attr = attributes[j];
                                    0 === attr.name.indexOf("data-ace-") && (scriptOptions[attr.name.replace(/^data-ace-/, "").replace(/-(.)/g, function(m, m1) {
                                        return m1.toUpperCase();
                                    })] = attr.value);
                                }
                                var m = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
                                m && (scriptUrl = m[1]);
                            }
                        }
                        for(var key in scriptUrl && (scriptOptions.base = scriptOptions.base || scriptUrl, scriptOptions.packaged = !0), scriptOptions.basePath = scriptOptions.base, scriptOptions.workerPath = scriptOptions.workerPath || scriptOptions.base, scriptOptions.modePath = scriptOptions.modePath || scriptOptions.base, scriptOptions.themePath = scriptOptions.themePath || scriptOptions.base, delete scriptOptions.base, scriptOptions)void 0 !== scriptOptions[key] && exports.set(key, scriptOptions[key]);
                    }
                }
                init(!0), exports.init = init, exports.version = "1.4.13";
            }), ace.define("ace/mouse/mouse_handler", [
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
                "ace/config"
            ], function(require, exports, module) {
                "use strict";
                var event = require("../lib/event"), useragent = require("../lib/useragent"), DefaultHandlers = require("./default_handlers").DefaultHandlers, DefaultGutterHandler = require("./default_gutter_handler").GutterHandler, MouseEvent = require("./mouse_event").MouseEvent, DragdropHandler = require("./dragdrop_handler").DragdropHandler, addTouchListeners = require("./touch_handler").addTouchListeners, config = require("../config"), MouseHandler = function(editor) {
                    var _self = this;
                    this.editor = editor, new DefaultHandlers(this), new DefaultGutterHandler(this), new DragdropHandler(this);
                    var focusEditor = function(e) {
                        document.hasFocus && document.hasFocus() && (editor.isFocused() || document.activeElement != (editor.textInput && editor.textInput.getElement())) || window.focus(), editor.focus();
                    }, mouseTarget = editor.renderer.getMouseEventTarget();
                    event.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"), editor), event.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"), editor), event.addMultiMouseDownListener([
                        mouseTarget,
                        editor.renderer.scrollBarV && editor.renderer.scrollBarV.inner,
                        editor.renderer.scrollBarH && editor.renderer.scrollBarH.inner,
                        editor.textInput && editor.textInput.getElement()
                    ].filter(Boolean), [
                        400,
                        300,
                        250
                    ], this, "onMouseEvent", editor), event.addMouseWheelListener(editor.container, this.onMouseWheel.bind(this, "mousewheel"), editor), addTouchListeners(editor.container, editor);
                    var gutterEl = editor.renderer.$gutter;
                    event.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"), editor), event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"), editor), event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"), editor), event.addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"), editor), event.addListener(mouseTarget, "mousedown", focusEditor, editor), event.addListener(gutterEl, "mousedown", focusEditor, editor), useragent.isIE && editor.renderer.scrollBarV && (event.addListener(editor.renderer.scrollBarV.element, "mousedown", focusEditor, editor), event.addListener(editor.renderer.scrollBarH.element, "mousedown", focusEditor, editor)), editor.on("mousemove", function(e) {
                        if (!_self.state && !_self.$dragDelay && _self.$dragEnabled) {
                            var character = editor.renderer.screenToTextCoordinates(e.x, e.y), range = editor.session.selection.getRange(), renderer = editor.renderer;
                            !range.isEmpty() && range.insideStart(character.row, character.column) ? renderer.setCursorStyle("default") : renderer.setCursorStyle("");
                        }
                    }, editor);
                };
                (function() {
                    this.onMouseEvent = function(name, e) {
                        this.editor.session && this.editor._emit(name, new MouseEvent(e, this.editor));
                    }, this.onMouseMove = function(name, e) {
                        var listeners = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
                        listeners && listeners.length && this.editor._emit(name, new MouseEvent(e, this.editor));
                    }, this.onMouseWheel = function(name, e) {
                        var mouseEvent = new MouseEvent(e, this.editor);
                        mouseEvent.speed = 2 * this.$scrollSpeed, mouseEvent.wheelX = e.wheelX, mouseEvent.wheelY = e.wheelY, this.editor._emit(name, mouseEvent);
                    }, this.setState = function(state) {
                        this.state = state;
                    }, this.captureMouse = function(ev, mouseMoveHandler) {
                        this.x = ev.x, this.y = ev.y, this.isMousePressed = !0;
                        var editor = this.editor, renderer = this.editor.renderer;
                        renderer.$isMousePressed = !0;
                        var self1 = this, onMouseMove = function(e) {
                            if (e) {
                                if (useragent.isWebKit && !e.which && self1.releaseMouse) return self1.releaseMouse();
                                self1.x = e.clientX, self1.y = e.clientY, mouseMoveHandler && mouseMoveHandler(e), self1.mouseEvent = new MouseEvent(e, self1.editor), self1.$mouseMoved = !0;
                            }
                        }, onCaptureEnd = function(e) {
                            editor.off("beforeEndOperation", onOperationEnd), clearInterval(timerId), editor.session && onCaptureInterval(), self1[self1.state + "End"] && self1[self1.state + "End"](e), self1.state = "", self1.isMousePressed = renderer.$isMousePressed = !1, renderer.$keepTextAreaAtCursor && renderer.$moveTextAreaToCursor(), self1.$onCaptureMouseMove = self1.releaseMouse = null, e && self1.onMouseEvent("mouseup", e), editor.endOperation();
                        }, onCaptureInterval = function() {
                            self1[self1.state] && self1[self1.state](), self1.$mouseMoved = !1;
                        };
                        if (useragent.isOldIE && "dblclick" == ev.domEvent.type) return setTimeout(function() {
                            onCaptureEnd(ev);
                        });
                        var onOperationEnd = function(e) {
                            self1.releaseMouse && editor.curOp.command.name && editor.curOp.selectionChanged && (self1[self1.state + "End"] && self1[self1.state + "End"](), self1.state = "", self1.releaseMouse());
                        };
                        editor.on("beforeEndOperation", onOperationEnd), editor.startOperation({
                            command: {
                                name: "mouse"
                            }
                        }), self1.$onCaptureMouseMove = onMouseMove, self1.releaseMouse = event.capture(this.editor.container, onMouseMove, onCaptureEnd);
                        var timerId = setInterval(onCaptureInterval, 20);
                    }, this.releaseMouse = null, this.cancelContextMenu = function() {
                        var stop = (function(e) {
                            (!e || !e.domEvent || "contextmenu" == e.domEvent.type) && (this.editor.off("nativecontextmenu", stop), e && e.domEvent && event.stopEvent(e.domEvent));
                        }).bind(this);
                        setTimeout(stop, 10), this.editor.on("nativecontextmenu", stop);
                    }, this.destroy = function() {
                        this.releaseMouse && this.releaseMouse();
                    };
                }).call(MouseHandler.prototype), config.defineOptions(MouseHandler.prototype, "mouseHandler", {
                    scrollSpeed: {
                        initialValue: 2
                    },
                    dragDelay: {
                        initialValue: useragent.isMac ? 150 : 0
                    },
                    dragEnabled: {
                        initialValue: !0
                    },
                    focusTimeout: {
                        initialValue: 0
                    },
                    tooltipFollowsMouse: {
                        initialValue: !0
                    }
                }), exports.MouseHandler = MouseHandler;
            }), ace.define("ace/mouse/fold_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom");
                exports.FoldHandler = function(editor) {
                    editor.on("click", function(e) {
                        var position = e.getDocumentPosition(), session = editor.session, fold = session.getFoldAt(position.row, position.column, 1);
                        fold && (e.getAccelKey() ? session.removeFold(fold) : session.expandFold(fold), e.stop());
                        var target = e.domEvent && e.domEvent.target;
                        target && dom.hasCssClass(target, "ace_inline_button") && dom.hasCssClass(target, "ace_toggle_wrap") && (session.setOption("wrap", !session.getUseWrapMode()), editor.renderer.scrollCursorIntoView());
                    }), editor.on("gutterclick", function(e) {
                        if ("foldWidgets" == editor.renderer.$gutterLayer.getRegion(e)) {
                            var row = e.getDocumentPosition().row, session = editor.session;
                            session.foldWidgets && session.foldWidgets[row] && editor.session.onFoldWidgetClick(row, e), editor.isFocused() || editor.focus(), e.stop();
                        }
                    }), editor.on("gutterdblclick", function(e) {
                        if ("foldWidgets" == editor.renderer.$gutterLayer.getRegion(e)) {
                            var row = e.getDocumentPosition().row, session = editor.session, data = session.getParentFoldRangeData(row, !0), range = data.range || data.firstRange;
                            if (range) {
                                row = range.start.row;
                                var fold = session.getFoldAt(row, session.getLine(row).length, 1);
                                fold ? session.removeFold(fold) : (session.addFold("...", range), editor.renderer.scrollCursorIntoView({
                                    row: range.start.row,
                                    column: 0
                                }));
                            }
                            e.stop();
                        }
                    });
                };
            }), ace.define("ace/keyboard/keybinding", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/event"
            ], function(require, exports, module) {
                "use strict";
                var keyUtil = require("../lib/keys"), event = require("../lib/event"), KeyBinding = function(editor) {
                    this.$editor = editor, this.$data = {
                        editor: editor
                    }, this.$handlers = [], this.setDefaultHandler(editor.commands);
                };
                (function() {
                    this.setDefaultHandler = function(kb) {
                        this.removeKeyboardHandler(this.$defaultHandler), this.$defaultHandler = kb, this.addKeyboardHandler(kb, 0);
                    }, this.setKeyboardHandler = function(kb) {
                        var h = this.$handlers;
                        if (h[h.length - 1] != kb) {
                            for(; h[h.length - 1] && h[h.length - 1] != this.$defaultHandler;)this.removeKeyboardHandler(h[h.length - 1]);
                            this.addKeyboardHandler(kb, 1);
                        }
                    }, this.addKeyboardHandler = function(kb, pos) {
                        if (kb) {
                            "function" != typeof kb || kb.handleKeyboard || (kb.handleKeyboard = kb);
                            var i = this.$handlers.indexOf(kb);
                            -1 != i && this.$handlers.splice(i, 1), void 0 == pos ? this.$handlers.push(kb) : this.$handlers.splice(pos, 0, kb), -1 == i && kb.attach && kb.attach(this.$editor);
                        }
                    }, this.removeKeyboardHandler = function(kb) {
                        var i = this.$handlers.indexOf(kb);
                        return -1 != i && (this.$handlers.splice(i, 1), kb.detach && kb.detach(this.$editor), !0);
                    }, this.getKeyboardHandler = function() {
                        return this.$handlers[this.$handlers.length - 1];
                    }, this.getStatusText = function() {
                        var data = this.$data, editor = data.editor;
                        return this.$handlers.map(function(h) {
                            return h.getStatusText && h.getStatusText(editor, data) || "";
                        }).filter(Boolean).join(" ");
                    }, this.$callKeyboardHandlers = function(hashId, keyString, keyCode, e) {
                        for(var toExecute, success = !1, commands = this.$editor.commands, i = this.$handlers.length; i-- && (!(toExecute = this.$handlers[i].handleKeyboard(this.$data, hashId, keyString, keyCode, e)) || !toExecute.command || ((success = "null" == toExecute.command || commands.exec(toExecute.command, this.$editor, toExecute.args, e)) && e && -1 != hashId && !0 != toExecute.passEvent && !0 != toExecute.command.passEvent && event.stopEvent(e), !success)););
                        return success || -1 != hashId || (toExecute = {
                            command: "insertstring"
                        }, success = commands.exec("insertstring", this.$editor, keyString)), success && this.$editor._signal && this.$editor._signal("keyboardActivity", toExecute), success;
                    }, this.onCommandKey = function(e, hashId, keyCode) {
                        var keyString = keyUtil.keyCodeToString(keyCode);
                        return this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
                    }, this.onTextInput = function(text) {
                        return this.$callKeyboardHandlers(-1, text);
                    };
                }).call(KeyBinding.prototype), exports.KeyBinding = KeyBinding;
            }), ace.define("ace/lib/bidiutil", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                var dir = 0, hiLevel = 0, lastArabic = !1, hasUBAT_B = !1, hasUBAT_S = !1, impTab_LTR = [
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
                    ]
                ], impTab_RTL = [
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
                    ]
                ], UnicodeTBL00 = [
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    6,
                    5,
                    6,
                    8,
                    5,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    5,
                    5,
                    5,
                    6,
                    8,
                    4,
                    4,
                    11,
                    11,
                    11,
                    4,
                    4,
                    4,
                    4,
                    4,
                    10,
                    9,
                    10,
                    9,
                    9,
                    2,
                    2,
                    2,
                    2,
                    2,
                    2,
                    2,
                    2,
                    2,
                    2,
                    9,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    4,
                    4,
                    4,
                    4,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    5,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    18,
                    9,
                    4,
                    11,
                    11,
                    11,
                    11,
                    4,
                    4,
                    4,
                    4,
                    0,
                    4,
                    4,
                    18,
                    4,
                    4,
                    11,
                    11,
                    2,
                    2,
                    4,
                    0,
                    4,
                    4,
                    4,
                    2,
                    0,
                    4,
                    4,
                    4,
                    4,
                    4
                ], UnicodeTBL20 = [
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    8,
                    18,
                    18,
                    18,
                    0,
                    1,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    8,
                    5,
                    13,
                    14,
                    15,
                    16,
                    17,
                    9,
                    11,
                    11,
                    11,
                    11,
                    11,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    9,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    4,
                    8
                ];
                function _invertLevel(lev, levels, _array) {
                    if (!(hiLevel < lev)) {
                        if (1 == lev && 1 == dir && !hasUBAT_B) {
                            _array.reverse();
                            return;
                        }
                        for(var end, lo, hi, tmp, len = _array.length, start = 0; start < len;){
                            if (levels[start] >= lev) {
                                for(end = start + 1; end < len && levels[end] >= lev;)end++;
                                for(lo = start, hi = end - 1; lo < hi; lo++, hi--)tmp = _array[lo], _array[lo] = _array[hi], _array[hi] = tmp;
                                start = end;
                            }
                            start++;
                        }
                    }
                }
                function _getCharacterType(ch) {
                    var uc = ch.charCodeAt(0), hi = uc >> 8;
                    return 0 == hi ? uc > 0x00bf ? 0 : UnicodeTBL00[uc] : 5 == hi ? /[\u0591-\u05f4]/.test(ch) ? 1 : 0 : 6 == hi ? /[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(ch) ? 12 : /[\u0660-\u0669\u066b-\u066c]/.test(ch) ? 3 : 0x066a == uc ? 11 : /[\u06f0-\u06f9]/.test(ch) ? 2 : 7 : 0x20 == hi && uc <= 0x205f ? UnicodeTBL20[0xff & uc] : 0xfe == hi && uc >= 0xfe70 ? 7 : 4;
                }
                exports.L = 0, exports.R = 1, exports.EN = 2, exports.ON_R = 3, exports.AN = 4, exports.R_H = 5, exports.B = 6, exports.RLE = 7, exports.DOT = "\xB7", exports.doBidiReorder = function(text, textCharTypes, isRtl) {
                    if (text.length < 2) return {};
                    var chars = text.split(""), logicalFromVisual = Array(chars.length), bidiLevels = Array(chars.length), levels = [];
                    dir = isRtl ? 1 : 0, function(chars, levels, len, charTypes) {
                        var impTab = dir ? impTab_RTL : impTab_LTR, prevState = null, newClass = null, newLevel = null, newState = 0, action = null, condPos = -1, i = null, ix = null, classes = [];
                        if (!charTypes) for(i = 0, charTypes = []; i < len; i++)charTypes[i] = _getCharacterType(chars[i]);
                        for(ix = 0, hiLevel = dir, lastArabic = !1, hasUBAT_B = !1, hasUBAT_S = !1; ix < len; ix++){
                            if (prevState = newState, classes[ix] = newClass = function(chars, types, classes, ix) {
                                var wType, nType, len, i, cType = types[ix];
                                switch(cType){
                                    case 0:
                                    case 1:
                                        lastArabic = !1;
                                    case 4:
                                    case 3:
                                        return cType;
                                    case 2:
                                        return lastArabic ? 3 : 2;
                                    case 7:
                                        return lastArabic = !0, 1;
                                    case 8:
                                        return 4;
                                    case 9:
                                        if (ix < 1 || ix + 1 >= types.length || 2 != (wType = classes[ix - 1]) && 3 != wType || 2 != (nType = types[ix + 1]) && 3 != nType) return 4;
                                        return lastArabic && (nType = 3), nType == wType ? nType : 4;
                                    case 10:
                                        if (2 == (wType = ix > 0 ? classes[ix - 1] : 5) && ix + 1 < types.length && 2 == types[ix + 1]) return 2;
                                        return 4;
                                    case 11:
                                        if (ix > 0 && 2 == classes[ix - 1]) return 2;
                                        if (lastArabic) return 4;
                                        for(i = ix + 1, len = types.length; i < len && 11 == types[i];)i++;
                                        if (i < len && 2 == types[i]) return 2;
                                        return 4;
                                    case 12:
                                        for(len = types.length, i = ix + 1; i < len && 12 == types[i];)i++;
                                        if (i < len) {
                                            var c = chars[ix];
                                            if (wType = types[i], (c >= 0x0591 && c <= 0x08ff || 0xfb1e == c) && (1 == wType || 7 == wType)) return 1;
                                        }
                                        if (ix < 1 || 5 == (wType = types[ix - 1])) return 4;
                                        return classes[ix - 1];
                                    case 5:
                                        return lastArabic = !1, hasUBAT_B = !0, dir;
                                    case 6:
                                        return hasUBAT_S = !0, 4;
                                    case 13:
                                    case 14:
                                    case 16:
                                    case 17:
                                    case 15:
                                        lastArabic = !1;
                                    case 18:
                                        return 4;
                                }
                            }(chars, charTypes, classes, ix), action = 0xf0 & (newState = impTab[prevState][newClass]), newState &= 0x0f, levels[ix] = newLevel = impTab[newState][5], action > 0) {
                                if (0x10 == action) {
                                    for(i = condPos; i < ix; i++)levels[i] = 1;
                                    condPos = -1;
                                } else condPos = -1;
                            }
                            if (impTab[newState][6]) -1 == condPos && (condPos = ix);
                            else if (condPos > -1) {
                                for(i = condPos; i < ix; i++)levels[i] = newLevel;
                                condPos = -1;
                            }
                            5 == charTypes[ix] && (levels[ix] = 0), hiLevel |= newLevel;
                        }
                        if (hasUBAT_S) {
                            for(i = 0; i < len; i++)if (6 == charTypes[i]) {
                                levels[i] = dir;
                                for(var j = i - 1; j >= 0; j--)if (8 == charTypes[j]) levels[j] = dir;
                                else break;
                            }
                        }
                    }(chars, levels, chars.length, textCharTypes);
                    for(var i = 0; i < logicalFromVisual.length; logicalFromVisual[i] = i, i++);
                    _invertLevel(2, levels, logicalFromVisual), _invertLevel(1, levels, logicalFromVisual);
                    for(var i = 0; i < logicalFromVisual.length - 1; i++)//fix levels to reflect character width
                    3 === textCharTypes[i] ? levels[i] = exports.AN : 1 === levels[i] && (textCharTypes[i] > 7 && textCharTypes[i] < 13 || 4 === textCharTypes[i] || 18 === textCharTypes[i]) ? levels[i] = exports.ON_R : i > 0 && "\u0644" === chars[i - 1] && /\u0622|\u0623|\u0625|\u0627/.test(chars[i]) && (levels[i - 1] = levels[i] = exports.R_H, i++);
                    chars[chars.length - 1] === exports.DOT && (levels[chars.length - 1] = exports.B), "\u202B" === chars[0] && (levels[0] = exports.RLE);
                    for(var i = 0; i < logicalFromVisual.length; i++)bidiLevels[i] = levels[logicalFromVisual[i]];
                    return {
                        logicalFromVisual: logicalFromVisual,
                        bidiLevels: bidiLevels
                    };
                }, exports.hasBidiCharacters = function(text, textCharTypes) {
                    for(var ret = !1, i = 0; i < text.length; i++)textCharTypes[i] = _getCharacterType(text.charAt(i)), ret || 1 != textCharTypes[i] && 7 != textCharTypes[i] && 3 != textCharTypes[i] || (ret = !0);
                    return ret;
                }, exports.getVisualFromLogicalIdx = function(logIdx, rowMap) {
                    for(var i = 0; i < rowMap.logicalFromVisual.length; i++)if (rowMap.logicalFromVisual[i] == logIdx) return i;
                    return 0;
                };
            }), ace.define("ace/bidihandler", [
                "require",
                "exports",
                "module",
                "ace/lib/bidiutil",
                "ace/lib/lang"
            ], function(require, exports, module) {
                "use strict";
                var bidiUtil = require("./lib/bidiutil"), lang = require("./lib/lang"), bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\u202B]/, BidiHandler = function(session) {
                    this.session = session, this.bidiMap = {}, this.currentRow = null, this.bidiUtil = bidiUtil, this.charWidths = [], this.EOL = "\xAC", this.showInvisibles = !0, this.isRtlDir = !1, this.$isRtl = !1, this.line = "", this.wrapIndent = 0, this.EOF = "\xB6", this.RLE = "\u202B", this.contentWidth = 0, this.fontMetrics = null, this.rtlLineOffset = 0, this.wrapOffset = 0, this.isMoveLeftOperation = !1, this.seenBidi = bidiRE.test(session.getValue());
                };
                (function() {
                    this.isBidiRow = function(screenRow, docRow, splitIndex) {
                        return !!this.seenBidi && (screenRow !== this.currentRow && (this.currentRow = screenRow, this.updateRowLine(docRow, splitIndex), this.updateBidiMap()), this.bidiMap.bidiLevels);
                    }, this.onChange = function(delta) {
                        this.seenBidi ? this.currentRow = null : "insert" == delta.action && bidiRE.test(delta.lines.join("\n")) && (this.seenBidi = !0, this.currentRow = null);
                    }, this.getDocumentRow = function() {
                        var docRow = 0, rowCache = this.session.$screenRowCache;
                        if (rowCache.length) {
                            var index = this.session.$getRowCacheIndex(rowCache, this.currentRow);
                            index >= 0 && (docRow = this.session.$docRowCache[index]);
                        }
                        return docRow;
                    }, this.getSplitIndex = function() {
                        var splitIndex = 0, rowCache = this.session.$screenRowCache;
                        if (rowCache.length) for(var currentIndex, prevIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow); this.currentRow - splitIndex > 0 && (currentIndex = this.session.$getRowCacheIndex(rowCache, this.currentRow - splitIndex - 1)) === prevIndex;)prevIndex = currentIndex, splitIndex++;
                        else splitIndex = this.currentRow;
                        return splitIndex;
                    }, this.updateRowLine = function(docRow, splitIndex) {
                        void 0 === docRow && (docRow = this.getDocumentRow());
                        var endOfLine = docRow === this.session.getLength() - 1 ? this.EOF : this.EOL;
                        if (this.wrapIndent = 0, this.line = this.session.getLine(docRow), this.isRtlDir = this.$isRtl || this.line.charAt(0) === this.RLE, this.session.$useWrapMode) {
                            var splits = this.session.$wrapData[docRow];
                            splits && (void 0 === splitIndex && (splitIndex = this.getSplitIndex()), splitIndex > 0 && splits.length ? (this.wrapIndent = splits.indent, this.wrapOffset = this.wrapIndent * this.charWidths[bidiUtil.L], this.line = splitIndex < splits.length ? this.line.substring(splits[splitIndex - 1], splits[splitIndex]) : this.line.substring(splits[splits.length - 1])) : this.line = this.line.substring(0, splits[splitIndex])), splitIndex == splits.length && (this.line += this.showInvisibles ? endOfLine : bidiUtil.DOT);
                        } else this.line += this.showInvisibles ? endOfLine : bidiUtil.DOT;
                        var size, session = this.session, shift = 0;
                        this.line = this.line.replace(/\t|[\u1100-\u2029, \u202F-\uFFE6]/g, function(ch, i) {
                            return "\t" === ch || session.isFullWidth(ch.charCodeAt(0)) ? (size = "\t" === ch ? session.getScreenTabSize(i + shift) : 2, shift += size - 1, lang.stringRepeat(bidiUtil.DOT, size)) : ch;
                        }), this.isRtlDir && (this.fontMetrics.$main.textContent = this.line.charAt(this.line.length - 1) == bidiUtil.DOT ? this.line.substr(0, this.line.length - 1) : this.line, this.rtlLineOffset = this.contentWidth - this.fontMetrics.$main.getBoundingClientRect().width);
                    }, this.updateBidiMap = function() {
                        var textCharTypes = [];
                        bidiUtil.hasBidiCharacters(this.line, textCharTypes) || this.isRtlDir ? this.bidiMap = bidiUtil.doBidiReorder(this.line, textCharTypes, this.isRtlDir) : this.bidiMap = {};
                    }, this.markAsDirty = function() {
                        this.currentRow = null;
                    }, this.updateCharacterWidths = function(fontMetrics) {
                        if (this.characterWidth !== fontMetrics.$characterSize.width) {
                            this.fontMetrics = fontMetrics;
                            var characterWidth = this.characterWidth = fontMetrics.$characterSize.width, bidiCharWidth = fontMetrics.$measureCharWidth("\u05d4");
                            this.charWidths[bidiUtil.L] = this.charWidths[bidiUtil.EN] = this.charWidths[bidiUtil.ON_R] = characterWidth, this.charWidths[bidiUtil.R] = this.charWidths[bidiUtil.AN] = bidiCharWidth, this.charWidths[bidiUtil.R_H] = 0.45 * bidiCharWidth, this.charWidths[bidiUtil.B] = this.charWidths[bidiUtil.RLE] = 0, this.currentRow = null;
                        }
                    }, this.setShowInvisibles = function(showInvisibles) {
                        this.showInvisibles = showInvisibles, this.currentRow = null;
                    }, this.setEolChar = function(eolChar) {
                        this.EOL = eolChar;
                    }, this.setContentWidth = function(width) {
                        this.contentWidth = width;
                    }, this.isRtlLine = function(row) {
                        return !!this.$isRtl || (void 0 != row ? this.session.getLine(row).charAt(0) == this.RLE : this.isRtlDir);
                    }, this.setRtlDirection = function(editor, isRtlDir) {
                        for(var cursor = editor.getCursorPosition(), row = editor.selection.getSelectionAnchor().row; row <= cursor.row; row++)isRtlDir || editor.session.getLine(row).charAt(0) !== editor.session.$bidiHandler.RLE ? isRtlDir && editor.session.getLine(row).charAt(0) !== editor.session.$bidiHandler.RLE && editor.session.doc.insert({
                            column: 0,
                            row: row
                        }, editor.session.$bidiHandler.RLE) : editor.session.doc.removeInLine(row, 0, 1);
                    }, this.getPosLeft = function(col) {
                        col -= this.wrapIndent;
                        var leftBoundary = this.line.charAt(0) === this.RLE ? 1 : 0, logicalIdx = col > leftBoundary ? this.session.getOverwrite() ? col : col - 1 : leftBoundary, visualIdx = bidiUtil.getVisualFromLogicalIdx(logicalIdx, this.bidiMap), levels = this.bidiMap.bidiLevels, left = 0;
                        !this.session.getOverwrite() && col <= leftBoundary && levels[visualIdx] % 2 != 0 && visualIdx++;
                        for(var i = 0; i < visualIdx; i++)left += this.charWidths[levels[i]];
                        return !this.session.getOverwrite() && col > leftBoundary && levels[visualIdx] % 2 == 0 && (left += this.charWidths[levels[visualIdx]]), this.wrapIndent && (left += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset), this.isRtlDir && (left += this.rtlLineOffset), left;
                    }, this.getSelections = function(startCol, endCol) {
                        var level, map = this.bidiMap, levels = map.bidiLevels, selections = [], offset = 0, selColMin = Math.min(startCol, endCol) - this.wrapIndent, selColMax = Math.max(startCol, endCol) - this.wrapIndent, isSelected = !1, isSelectedPrev = !1, selectionStart = 0;
                        this.wrapIndent && (offset += this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset);
                        for(var logIdx, visIdx = 0; visIdx < levels.length; visIdx++)logIdx = map.logicalFromVisual[visIdx], level = levels[visIdx], (isSelected = logIdx >= selColMin && logIdx < selColMax) && !isSelectedPrev ? selectionStart = offset : !isSelected && isSelectedPrev && selections.push({
                            left: selectionStart,
                            width: offset - selectionStart
                        }), offset += this.charWidths[level], isSelectedPrev = isSelected;
                        if (isSelected && visIdx === levels.length && selections.push({
                            left: selectionStart,
                            width: offset - selectionStart
                        }), this.isRtlDir) for(var i = 0; i < selections.length; i++)selections[i].left += this.rtlLineOffset;
                        return selections;
                    }, this.offsetToCol = function(posX) {
                        this.isRtlDir && (posX -= this.rtlLineOffset);
                        var logicalIdx = 0, posX = Math.max(posX, 0), offset = 0, visualIdx = 0, levels = this.bidiMap.bidiLevels, charWidth = this.charWidths[levels[visualIdx]];
                        for(this.wrapIndent && (posX -= this.isRtlDir ? -1 * this.wrapOffset : this.wrapOffset); posX > offset + charWidth / 2;){
                            if (offset += charWidth, visualIdx === levels.length - 1) {
                                charWidth = 0;
                                break;
                            }
                            charWidth = this.charWidths[levels[++visualIdx]];
                        }
                        return visualIdx > 0 && levels[visualIdx - 1] % 2 != 0 && levels[visualIdx] % 2 == 0 ? (posX < offset && visualIdx--, logicalIdx = this.bidiMap.logicalFromVisual[visualIdx]) : visualIdx > 0 && levels[visualIdx - 1] % 2 == 0 && levels[visualIdx] % 2 != 0 ? logicalIdx = 1 + (posX > offset ? this.bidiMap.logicalFromVisual[visualIdx] : this.bidiMap.logicalFromVisual[visualIdx - 1]) : this.isRtlDir && visualIdx === levels.length - 1 && 0 === charWidth && levels[visualIdx - 1] % 2 == 0 || !this.isRtlDir && 0 === visualIdx && levels[visualIdx] % 2 != 0 ? logicalIdx = 1 + this.bidiMap.logicalFromVisual[visualIdx] : (visualIdx > 0 && levels[visualIdx - 1] % 2 != 0 && 0 !== charWidth && visualIdx--, logicalIdx = this.bidiMap.logicalFromVisual[visualIdx]), 0 === logicalIdx && this.isRtlDir && logicalIdx++, logicalIdx + this.wrapIndent;
                    };
                }).call(BidiHandler.prototype), exports.BidiHandler = BidiHandler;
            }), ace.define("ace/selection", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), lang = require("./lib/lang"), EventEmitter = require("./lib/event_emitter").EventEmitter, Range = require("./range").Range, Selection = function(session) {
                    this.session = session, this.doc = session.getDocument(), this.clearSelection(), this.cursor = this.lead = this.doc.createAnchor(0, 0), this.anchor = this.doc.createAnchor(0, 0), this.$silent = !1;
                    var self1 = this;
                    this.cursor.on("change", function(e) {
                        self1.$cursorChanged = !0, self1.$silent || self1._emit("changeCursor"), self1.$isEmpty || self1.$silent || self1._emit("changeSelection"), self1.$keepDesiredColumnOnChange || e.old.column == e.value.column || (self1.$desiredColumn = null);
                    }), this.anchor.on("change", function() {
                        self1.$anchorChanged = !0, self1.$isEmpty || self1.$silent || self1._emit("changeSelection");
                    });
                };
                (function() {
                    oop.implement(this, EventEmitter), this.isEmpty = function() {
                        return this.$isEmpty || this.anchor.row == this.lead.row && this.anchor.column == this.lead.column;
                    }, this.isMultiLine = function() {
                        return !this.$isEmpty && this.anchor.row != this.cursor.row;
                    }, this.getCursor = function() {
                        return this.lead.getPosition();
                    }, this.setSelectionAnchor = function(row, column) {
                        this.$isEmpty = !1, this.anchor.setPosition(row, column);
                    }, this.getAnchor = this.getSelectionAnchor = function() {
                        return this.$isEmpty ? this.getSelectionLead() : this.anchor.getPosition();
                    }, this.getSelectionLead = function() {
                        return this.lead.getPosition();
                    }, this.isBackwards = function() {
                        var anchor = this.anchor, lead = this.lead;
                        return anchor.row > lead.row || anchor.row == lead.row && anchor.column > lead.column;
                    }, this.getRange = function() {
                        var anchor = this.anchor, lead = this.lead;
                        return this.$isEmpty ? Range.fromPoints(lead, lead) : this.isBackwards() ? Range.fromPoints(lead, anchor) : Range.fromPoints(anchor, lead);
                    }, this.clearSelection = function() {
                        this.$isEmpty || (this.$isEmpty = !0, this._emit("changeSelection"));
                    }, this.selectAll = function() {
                        this.$setSelection(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
                    }, this.setRange = this.setSelectionRange = function(range, reverse) {
                        var start = reverse ? range.end : range.start, end = reverse ? range.start : range.end;
                        this.$setSelection(start.row, start.column, end.row, end.column);
                    }, this.$setSelection = function(anchorRow, anchorColumn, cursorRow, cursorColumn) {
                        if (!this.$silent) {
                            var wasEmpty = this.$isEmpty, wasMultiselect = this.inMultiSelectMode;
                            this.$silent = !0, this.$cursorChanged = this.$anchorChanged = !1, this.anchor.setPosition(anchorRow, anchorColumn), this.cursor.setPosition(cursorRow, cursorColumn), this.$isEmpty = !Range.comparePoints(this.anchor, this.cursor), this.$silent = !1, this.$cursorChanged && this._emit("changeCursor"), (this.$cursorChanged || this.$anchorChanged || wasEmpty != this.$isEmpty || wasMultiselect) && this._emit("changeSelection");
                        }
                    }, this.$moveSelection = function(mover) {
                        var lead = this.lead;
                        this.$isEmpty && this.setSelectionAnchor(lead.row, lead.column), mover.call(this);
                    }, this.selectTo = function(row, column) {
                        this.$moveSelection(function() {
                            this.moveCursorTo(row, column);
                        });
                    }, this.selectToPosition = function(pos) {
                        this.$moveSelection(function() {
                            this.moveCursorToPosition(pos);
                        });
                    }, this.moveTo = function(row, column) {
                        this.clearSelection(), this.moveCursorTo(row, column);
                    }, this.moveToPosition = function(pos) {
                        this.clearSelection(), this.moveCursorToPosition(pos);
                    }, this.selectUp = function() {
                        this.$moveSelection(this.moveCursorUp);
                    }, this.selectDown = function() {
                        this.$moveSelection(this.moveCursorDown);
                    }, this.selectRight = function() {
                        this.$moveSelection(this.moveCursorRight);
                    }, this.selectLeft = function() {
                        this.$moveSelection(this.moveCursorLeft);
                    }, this.selectLineStart = function() {
                        this.$moveSelection(this.moveCursorLineStart);
                    }, this.selectLineEnd = function() {
                        this.$moveSelection(this.moveCursorLineEnd);
                    }, this.selectFileEnd = function() {
                        this.$moveSelection(this.moveCursorFileEnd);
                    }, this.selectFileStart = function() {
                        this.$moveSelection(this.moveCursorFileStart);
                    }, this.selectWordRight = function() {
                        this.$moveSelection(this.moveCursorWordRight);
                    }, this.selectWordLeft = function() {
                        this.$moveSelection(this.moveCursorWordLeft);
                    }, this.getWordRange = function(row, column) {
                        if (void 0 === column) {
                            var cursor = row || this.lead;
                            row = cursor.row, column = cursor.column;
                        }
                        return this.session.getWordRange(row, column);
                    }, this.selectWord = function() {
                        this.setSelectionRange(this.getWordRange());
                    }, this.selectAWord = function() {
                        var cursor = this.getCursor(), range = this.session.getAWordRange(cursor.row, cursor.column);
                        this.setSelectionRange(range);
                    }, this.getLineRange = function(row, excludeLastChar) {
                        var rowEnd, rowStart = "number" == typeof row ? row : this.lead.row, foldLine = this.session.getFoldLine(rowStart);
                        return (foldLine ? (rowStart = foldLine.start.row, rowEnd = foldLine.end.row) : rowEnd = rowStart, !0 === excludeLastChar) ? new Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length) : new Range(rowStart, 0, rowEnd + 1, 0);
                    }, this.selectLine = function() {
                        this.setSelectionRange(this.getLineRange());
                    }, this.moveCursorUp = function() {
                        this.moveCursorBy(-1, 0);
                    }, this.moveCursorDown = function() {
                        this.moveCursorBy(1, 0);
                    }, this.wouldMoveIntoSoftTab = function(cursor, tabSize, direction) {
                        var start = cursor.column, end = cursor.column + tabSize;
                        return direction < 0 && (start = cursor.column - tabSize, end = cursor.column), this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(start, end).split(" ").length - 1 == tabSize;
                    }, this.moveCursorLeft = function() {
                        var fold, cursor = this.lead.getPosition();
                        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) this.moveCursorTo(fold.start.row, fold.start.column);
                        else if (0 === cursor.column) cursor.row > 0 && this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
                        else {
                            var tabSize = this.session.getTabSize();
                            this.wouldMoveIntoSoftTab(cursor, tabSize, -1) && !this.session.getNavigateWithinSoftTabs() ? this.moveCursorBy(0, -tabSize) : this.moveCursorBy(0, -1);
                        }
                    }, this.moveCursorRight = function() {
                        var fold, cursor = this.lead.getPosition();
                        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) this.moveCursorTo(fold.end.row, fold.end.column);
                        else if (this.lead.column == this.doc.getLine(this.lead.row).length) this.lead.row < this.doc.getLength() - 1 && this.moveCursorTo(this.lead.row + 1, 0);
                        else {
                            var tabSize = this.session.getTabSize(), cursor = this.lead;
                            this.wouldMoveIntoSoftTab(cursor, tabSize, 1) && !this.session.getNavigateWithinSoftTabs() ? this.moveCursorBy(0, tabSize) : this.moveCursorBy(0, 1);
                        }
                    }, this.moveCursorLineStart = function() {
                        var row = this.lead.row, column = this.lead.column, screenRow = this.session.documentToScreenRow(row, column), firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0), leadingSpace = this.session.getDisplayLine(row, null, firstColumnPosition.row, firstColumnPosition.column).match(/^\s*/);
                        leadingSpace[0].length == column || this.session.$useEmacsStyleLineStart || (firstColumnPosition.column += leadingSpace[0].length), this.moveCursorToPosition(firstColumnPosition);
                    }, this.moveCursorLineEnd = function() {
                        var lead = this.lead, lineEnd = this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
                        if (this.lead.column == lineEnd.column) {
                            var line = this.session.getLine(lineEnd.row);
                            if (lineEnd.column == line.length) {
                                var textEnd = line.search(/\s+$/);
                                textEnd > 0 && (lineEnd.column = textEnd);
                            }
                        }
                        this.moveCursorTo(lineEnd.row, lineEnd.column);
                    }, this.moveCursorFileEnd = function() {
                        var row = this.doc.getLength() - 1, column = this.doc.getLine(row).length;
                        this.moveCursorTo(row, column);
                    }, this.moveCursorFileStart = function() {
                        this.moveCursorTo(0, 0);
                    }, this.moveCursorLongWordRight = function() {
                        var row = this.lead.row, column = this.lead.column, line = this.doc.getLine(row), rightOfCursor = line.substring(column);
                        this.session.nonTokenRe.lastIndex = 0, this.session.tokenRe.lastIndex = 0;
                        var fold = this.session.getFoldAt(row, column, 1);
                        if (fold) {
                            this.moveCursorTo(fold.end.row, fold.end.column);
                            return;
                        }
                        if (this.session.nonTokenRe.exec(rightOfCursor) && (column += this.session.nonTokenRe.lastIndex, this.session.nonTokenRe.lastIndex = 0, rightOfCursor = line.substring(column)), column >= line.length) {
                            this.moveCursorTo(row, line.length), this.moveCursorRight(), row < this.doc.getLength() - 1 && this.moveCursorWordRight();
                            return;
                        }
                        this.session.tokenRe.exec(rightOfCursor) && (column += this.session.tokenRe.lastIndex, this.session.tokenRe.lastIndex = 0), this.moveCursorTo(row, column);
                    }, this.moveCursorLongWordLeft = function() {
                        var fold, row = this.lead.row, column = this.lead.column;
                        if (fold = this.session.getFoldAt(row, column, -1)) {
                            this.moveCursorTo(fold.start.row, fold.start.column);
                            return;
                        }
                        var str = this.session.getFoldStringAt(row, column, -1);
                        null == str && (str = this.doc.getLine(row).substring(0, column));
                        var leftOfCursor = lang.stringReverse(str);
                        if (this.session.nonTokenRe.lastIndex = 0, this.session.tokenRe.lastIndex = 0, this.session.nonTokenRe.exec(leftOfCursor) && (column -= this.session.nonTokenRe.lastIndex, leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex), this.session.nonTokenRe.lastIndex = 0), column <= 0) {
                            this.moveCursorTo(row, 0), this.moveCursorLeft(), row > 0 && this.moveCursorWordLeft();
                            return;
                        }
                        this.session.tokenRe.exec(leftOfCursor) && (column -= this.session.tokenRe.lastIndex, this.session.tokenRe.lastIndex = 0), this.moveCursorTo(row, column);
                    }, this.$shortWordEndIndex = function(rightOfCursor) {
                        var ch, index = 0, whitespaceRe = /\s/, tokenRe = this.session.tokenRe;
                        if (tokenRe.lastIndex = 0, this.session.tokenRe.exec(rightOfCursor)) index = this.session.tokenRe.lastIndex;
                        else {
                            for(; (ch = rightOfCursor[index]) && whitespaceRe.test(ch);)index++;
                            if (index < 1) {
                                for(tokenRe.lastIndex = 0; (ch = rightOfCursor[index]) && !tokenRe.test(ch);)if (tokenRe.lastIndex = 0, index++, whitespaceRe.test(ch)) {
                                    if (index > 2) {
                                        index--;
                                        break;
                                    }
                                    for(; (ch = rightOfCursor[index]) && whitespaceRe.test(ch);)index++;
                                    if (index > 2) break;
                                }
                            }
                        }
                        return tokenRe.lastIndex = 0, index;
                    }, this.moveCursorShortWordRight = function() {
                        var row = this.lead.row, column = this.lead.column, line = this.doc.getLine(row), rightOfCursor = line.substring(column), fold = this.session.getFoldAt(row, column, 1);
                        if (fold) return this.moveCursorTo(fold.end.row, fold.end.column);
                        if (column == line.length) {
                            var l = this.doc.getLength();
                            do row++, rightOfCursor = this.doc.getLine(row);
                            while (row < l && /^\s*$/.test(rightOfCursor))
                            /^\s+/.test(rightOfCursor) || (rightOfCursor = ""), column = 0;
                        }
                        var index = this.$shortWordEndIndex(rightOfCursor);
                        this.moveCursorTo(row, column + index);
                    }, this.moveCursorShortWordLeft = function() {
                        var fold, row = this.lead.row, column = this.lead.column;
                        if (fold = this.session.getFoldAt(row, column, -1)) return this.moveCursorTo(fold.start.row, fold.start.column);
                        var line = this.session.getLine(row).substring(0, column);
                        if (0 === column) {
                            do row--, line = this.doc.getLine(row);
                            while (row > 0 && /^\s*$/.test(line))
                            column = line.length, /\s+$/.test(line) || (line = "");
                        }
                        var leftOfCursor = lang.stringReverse(line), index = this.$shortWordEndIndex(leftOfCursor);
                        return this.moveCursorTo(row, column - index);
                    }, this.moveCursorWordRight = function() {
                        this.session.$selectLongWords ? this.moveCursorLongWordRight() : this.moveCursorShortWordRight();
                    }, this.moveCursorWordLeft = function() {
                        this.session.$selectLongWords ? this.moveCursorLongWordLeft() : this.moveCursorShortWordLeft();
                    }, this.moveCursorBy = function(rows, chars) {
                        var offsetX, screenPos = this.session.documentToScreenPosition(this.lead.row, this.lead.column);
                        if (0 === chars && (0 !== rows && (this.session.$bidiHandler.isBidiRow(screenPos.row, this.lead.row) ? (offsetX = this.session.$bidiHandler.getPosLeft(screenPos.column), screenPos.column = Math.round(offsetX / this.session.$bidiHandler.charWidths[0])) : offsetX = screenPos.column * this.session.$bidiHandler.charWidths[0]), this.$desiredColumn ? screenPos.column = this.$desiredColumn : this.$desiredColumn = screenPos.column), 0 != rows && this.session.lineWidgets && this.session.lineWidgets[this.lead.row]) {
                            var widget = this.session.lineWidgets[this.lead.row];
                            rows < 0 ? rows -= widget.rowsAbove || 0 : rows > 0 && (rows += widget.rowCount - (widget.rowsAbove || 0));
                        }
                        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column, offsetX);
                        0 !== rows && 0 === chars && docPos.row === this.lead.row && (docPos.column, this.lead.column), this.moveCursorTo(docPos.row, docPos.column + chars, 0 === chars);
                    }, this.moveCursorToPosition = function(position) {
                        this.moveCursorTo(position.row, position.column);
                    }, this.moveCursorTo = function(row, column, keepDesiredColumn) {
                        var fold = this.session.getFoldAt(row, column, 1);
                        fold && (row = fold.start.row, column = fold.start.column), this.$keepDesiredColumnOnChange = !0;
                        var line = this.session.getLine(row);
                        /[\uDC00-\uDFFF]/.test(line.charAt(column)) && line.charAt(column - 1) && (this.lead.row == row && this.lead.column == column + 1 ? column -= 1 : column += 1), this.lead.setPosition(row, column), this.$keepDesiredColumnOnChange = !1, keepDesiredColumn || (this.$desiredColumn = null);
                    }, this.moveCursorToScreen = function(row, column, keepDesiredColumn) {
                        var pos = this.session.screenToDocumentPosition(row, column);
                        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
                    }, this.detach = function() {
                        this.lead.detach(), this.anchor.detach();
                    }, this.fromOrientedRange = function(range) {
                        this.setSelectionRange(range, range.cursor == range.start), this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
                    }, this.toOrientedRange = function(range) {
                        var r = this.getRange();
                        return range ? (range.start.column = r.start.column, range.start.row = r.start.row, range.end.column = r.end.column, range.end.row = r.end.row) : range = r, range.cursor = this.isBackwards() ? range.start : range.end, range.desiredColumn = this.$desiredColumn, range;
                    }, this.getRangeOfMovements = function(func) {
                        var start = this.getCursor();
                        try {
                            func(this);
                            var end = this.getCursor();
                            return Range.fromPoints(start, end);
                        } catch (e) {
                            return Range.fromPoints(start, start);
                        } finally{
                            this.moveCursorToPosition(start);
                        }
                    }, this.toJSON = function() {
                        if (this.rangeCount) var data = this.ranges.map(function(r) {
                            var r1 = r.clone();
                            return r1.isBackwards = r.cursor == r.start, r1;
                        });
                        else {
                            var data = this.getRange();
                            data.isBackwards = this.isBackwards();
                        }
                        return data;
                    }, this.fromJSON = function(data) {
                        if (void 0 == data.start) {
                            if (this.rangeList && data.length > 1) {
                                this.toSingleRange(data[0]);
                                for(var i = data.length; i--;){
                                    var r = Range.fromPoints(data[i].start, data[i].end);
                                    data[i].isBackwards && (r.cursor = r.start), this.addRange(r, !0);
                                }
                                return;
                            }
                            data = data[0];
                        }
                        this.rangeList && this.toSingleRange(data), this.setSelectionRange(data, data.isBackwards);
                    }, this.isEqual = function(data) {
                        if ((data.length || this.rangeCount) && data.length != this.rangeCount) return !1;
                        if (!data.length || !this.ranges) return this.getRange().isEqual(data);
                        for(var i = this.ranges.length; i--;)if (!this.ranges[i].isEqual(data[i])) return !1;
                        return !0;
                    };
                }).call(Selection.prototype), exports.Selection = Selection;
            }), ace.define("ace/tokenizer", [
                "require",
                "exports",
                "module",
                "ace/config"
            ], function(require, exports, module) {
                "use strict";
                var config = require("./config"), MAX_TOKEN_COUNT = 2000, Tokenizer = function(rules) {
                    for(var key in this.states = rules, this.regExps = {}, this.matchMappings = {}, this.states){
                        for(var state = this.states[key], ruleRegExps = [], matchTotal = 0, mapping = this.matchMappings[key] = {
                            defaultToken: "text"
                        }, flag = "g", splitterRurles = [], i = 0; i < state.length; i++){
                            var rule = state[i];
                            if (rule.defaultToken && (mapping.defaultToken = rule.defaultToken), rule.caseInsensitive && (flag = "gi"), null != rule.regex) {
                                rule.regex instanceof RegExp && (rule.regex = rule.regex.toString().slice(1, -1));
                                var adjustedregex = rule.regex, matchcount = RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
                                Array.isArray(rule.token) ? 1 == rule.token.length || 1 == matchcount ? rule.token = rule.token[0] : matchcount - 1 != rule.token.length ? (this.reportError("number of classes and regexp groups doesn't match", {
                                    rule: rule,
                                    groupCount: matchcount - 1
                                }), rule.token = rule.token[0]) : (rule.tokenArray = rule.token, rule.token = null, rule.onMatch = this.$arrayTokens) : "function" != typeof rule.token || rule.onMatch || (matchcount > 1 ? rule.onMatch = this.$applyToken : rule.onMatch = rule.token), matchcount > 1 && (/\\\d/.test(rule.regex) ? adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function(match, digit) {
                                    return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                                }) : (matchcount = 1, adjustedregex = this.removeCapturingGroups(rule.regex)), rule.splitRegex || "string" == typeof rule.token || splitterRurles.push(rule)), mapping[matchTotal] = i, matchTotal += matchcount, ruleRegExps.push(adjustedregex), rule.onMatch || (rule.onMatch = null);
                            }
                        }
                        ruleRegExps.length || (mapping[0] = 0, ruleRegExps.push("$")), splitterRurles.forEach(function(rule) {
                            rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
                        }, this), this.regExps[key] = RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
                    }
                };
                (function() {
                    this.$setMaxTokenCount = function(m) {
                        MAX_TOKEN_COUNT = 0 | m;
                    }, this.$applyToken = function(str) {
                        var values = this.splitRegex.exec(str).slice(1), types = this.token.apply(this, values);
                        if ("string" == typeof types) return [
                            {
                                type: types,
                                value: str
                            }
                        ];
                        for(var tokens = [], i = 0, l = types.length; i < l; i++)values[i] && (tokens[tokens.length] = {
                            type: types[i],
                            value: values[i]
                        });
                        return tokens;
                    }, this.$arrayTokens = function(str) {
                        if (!str) return [];
                        var values = this.splitRegex.exec(str);
                        if (!values) return "text";
                        for(var tokens = [], types = this.tokenArray, i = 0, l = types.length; i < l; i++)values[i + 1] && (tokens[tokens.length] = {
                            type: types[i],
                            value: values[i + 1]
                        });
                        return tokens;
                    }, this.removeCapturingGroups = function(src) {
                        return src.replace(/\\.|\[(?:\\.|[^\\\]])*|\(\?[:=!<]|(\()/g, function(x, y) {
                            return y ? "(?:" : x;
                        });
                    }, this.createSplitterRegexp = function(src, flag) {
                        if (-1 != src.indexOf("(?=")) {
                            var stack = 0, inChClass = !1, lastCapture = {};
                            src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(m, esc, parenOpen, parenClose, square, index) {
                                return inChClass ? inChClass = "]" != square : square ? inChClass = !0 : parenClose ? (stack == lastCapture.stack && (lastCapture.end = index + 1, lastCapture.stack = -1), stack--) : parenOpen && (stack++, 1 != parenOpen.length && (lastCapture.stack = stack, lastCapture.start = index)), m;
                            }), null != lastCapture.end && /^\)*$/.test(src.substr(lastCapture.end)) && (src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end));
                        }
                        return "^" != src.charAt(0) && (src = "^" + src), "$" != src.charAt(src.length - 1) && (src += "$"), new RegExp(src, (flag || "").replace("g", ""));
                    }, this.getLineTokens = function(line, startState) {
                        if (startState && "string" != typeof startState) {
                            var stack = startState.slice(0);
                            "#tmp" === (startState = stack[0]) && (stack.shift(), startState = stack.shift());
                        } else var stack = [];
                        var currentState = startState || "start", state = this.states[currentState];
                        state || (currentState = "start", state = this.states[currentState]);
                        var mapping = this.matchMappings[currentState], re = this.regExps[currentState];
                        re.lastIndex = 0;
                        for(var match, tokens = [], lastIndex = 0, matchAttempts = 0, token = {
                            type: null,
                            value: ""
                        }; match = re.exec(line);){
                            var type = mapping.defaultToken, rule = null, value = match[0], index = re.lastIndex;
                            if (index - value.length > lastIndex) {
                                var skipped = line.substring(lastIndex, index - value.length);
                                token.type == type ? token.value += skipped : (token.type && tokens.push(token), token = {
                                    type: type,
                                    value: skipped
                                });
                            }
                            for(var i = 0; i < match.length - 2; i++)if (void 0 !== match[i + 1]) {
                                type = (rule = state[mapping[i]]).onMatch ? rule.onMatch(value, currentState, stack, line) : rule.token, rule.next && (currentState = "string" == typeof rule.next ? rule.next : rule.next(currentState, stack), (state = this.states[currentState]) || (this.reportError("state doesn't exist", currentState), currentState = "start", state = this.states[currentState]), mapping = this.matchMappings[currentState], lastIndex = index, (re = this.regExps[currentState]).lastIndex = index), rule.consumeLineEnd && (lastIndex = index);
                                break;
                            }
                            if (value) {
                                if ("string" == typeof type) rule && !1 === rule.merge || token.type !== type ? (token.type && tokens.push(token), token = {
                                    type: type,
                                    value: value
                                }) : token.value += value;
                                else if (type) {
                                    token.type && tokens.push(token), token = {
                                        type: null,
                                        value: ""
                                    };
                                    for(var i = 0; i < type.length; i++)tokens.push(type[i]);
                                }
                            }
                            if (lastIndex == line.length) break;
                            if (lastIndex = index, matchAttempts++ > MAX_TOKEN_COUNT) {
                                for(matchAttempts > 2 * line.length && this.reportError("infinite loop with in ace tokenizer", {
                                    startState: startState,
                                    line: line
                                }); lastIndex < line.length;)token.type && tokens.push(token), token = {
                                    value: line.substring(lastIndex, lastIndex += 500),
                                    type: "overflow"
                                };
                                currentState = "start", stack = [];
                                break;
                            }
                        }
                        return token.type && tokens.push(token), stack.length > 1 && stack[0] !== currentState && stack.unshift("#tmp", currentState), {
                            tokens: tokens,
                            state: stack.length ? stack : currentState
                        };
                    }, this.reportError = config.reportError;
                }).call(Tokenizer.prototype), exports.Tokenizer = Tokenizer;
            }), ace.define("ace/mode/text_highlight_rules", [
                "require",
                "exports",
                "module",
                "ace/lib/lang"
            ], function(require, exports, module) {
                "use strict";
                var lang = require("../lib/lang"), TextHighlightRules = function() {
                    this.$rules = {
                        start: [
                            {
                                token: "empty_line",
                                regex: "^$"
                            },
                            {
                                defaultToken: "text"
                            }
                        ]
                    };
                };
                (function() {
                    this.addRules = function(rules, prefix) {
                        if (!prefix) {
                            for(var key in rules)this.$rules[key] = rules[key];
                            return;
                        }
                        for(var key in rules){
                            for(var state = rules[key], i = 0; i < state.length; i++){
                                var rule = state[i];
                                (rule.next || rule.onMatch) && ("string" == typeof rule.next && 0 !== rule.next.indexOf(prefix) && (rule.next = prefix + rule.next), rule.nextState && 0 !== rule.nextState.indexOf(prefix) && (rule.nextState = prefix + rule.nextState));
                            }
                            this.$rules[prefix + key] = state;
                        }
                    }, this.getRules = function() {
                        return this.$rules;
                    }, this.embedRules = function(HighlightRules, prefix, escapeRules, states, append) {
                        var embedRules = "function" == typeof HighlightRules ? new HighlightRules().getRules() : HighlightRules;
                        if (states) for(var i = 0; i < states.length; i++)states[i] = prefix + states[i];
                        else for(var key in states = [], embedRules)states.push(prefix + key);
                        if (this.addRules(embedRules, prefix), escapeRules) for(var addRules = Array.prototype[append ? "push" : "unshift"], i = 0; i < states.length; i++)addRules.apply(this.$rules[states[i]], lang.deepCopy(escapeRules));
                        this.$embeds || (this.$embeds = []), this.$embeds.push(prefix);
                    }, this.getEmbeds = function() {
                        return this.$embeds;
                    };
                    var pushState = function(currentState, stack) {
                        return ("start" != currentState || stack.length) && stack.unshift(this.nextState, currentState), this.nextState;
                    }, popState = function(currentState, stack) {
                        return stack.shift(), stack.shift() || "start";
                    };
                    this.normalizeRules = function() {
                        var id = 0, rules = this.$rules;
                        Object.keys(rules).forEach(function processState(key) {
                            var state = rules[key];
                            state.processed = !0;
                            for(var i = 0; i < state.length; i++){
                                var rule = state[i], toInsert = null;
                                Array.isArray(rule) && (toInsert = rule, rule = {}), !rule.regex && rule.start && (rule.regex = rule.start, rule.next || (rule.next = []), rule.next.push({
                                    defaultToken: rule.token
                                }, {
                                    token: rule.token + ".end",
                                    regex: rule.end || rule.start,
                                    next: "pop"
                                }), rule.token = rule.token + ".start", rule.push = !0);
                                var next = rule.next || rule.push;
                                if (next && Array.isArray(next)) {
                                    var stateName = rule.stateName;
                                    !stateName && ("string" != typeof (stateName = rule.token) && (stateName = stateName[0] || ""), rules[stateName] && (stateName += id++)), rules[stateName] = next, rule.next = stateName, processState(stateName);
                                } else "pop" == next && (rule.next = popState);
                                if (rule.push && (rule.nextState = rule.next || rule.push, rule.next = pushState, delete rule.push), rule.rules) for(var r in rule.rules)rules[r] ? rules[r].push && rules[r].push.apply(rules[r], rule.rules[r]) : rules[r] = rule.rules[r];
                                var includeName = "string" == typeof rule ? rule : rule.include;
                                if (includeName && (toInsert = Array.isArray(includeName) ? includeName.map(function(x) {
                                    return rules[x];
                                }) : rules[includeName]), toInsert) {
                                    var args = [
                                        i,
                                        1
                                    ].concat(toInsert);
                                    rule.noEscape && (args = args.filter(function(x) {
                                        return !x.next;
                                    })), state.splice.apply(state, args), i--;
                                }
                                rule.keywordMap && (rule.token = this.createKeywordMapper(rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive), delete rule.defaultToken);
                            }
                        }, this);
                    }, this.createKeywordMapper = function(map, defaultToken, ignoreCase, splitChar) {
                        var keywords = Object.create(null);
                        return this.$keywordList = [], Object.keys(map).forEach(function(className) {
                            for(var list = map[className].split(splitChar || "|"), i = list.length; i--;){
                                var word = list[i];
                                this.$keywordList.push(word), ignoreCase && (word = word.toLowerCase()), keywords[word] = className;
                            }
                        }, this), map = null, ignoreCase ? function(value) {
                            return keywords[value.toLowerCase()] || defaultToken;
                        } : function(value) {
                            return keywords[value] || defaultToken;
                        };
                    }, this.getKeywords = function() {
                        return this.$keywords;
                    };
                }).call(TextHighlightRules.prototype), exports.TextHighlightRules = TextHighlightRules;
            }), ace.define("ace/mode/behaviour", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                var Behaviour = function() {
                    this.$behaviours = {};
                };
                (function() {
                    this.add = function(name, action, callback) {
                        switch(void 0){
                            case this.$behaviours:
                                this.$behaviours = {};
                            case this.$behaviours[name]:
                                this.$behaviours[name] = {};
                        }
                        this.$behaviours[name][action] = callback;
                    }, this.addBehaviours = function(behaviours) {
                        for(var key in behaviours)for(var action in behaviours[key])this.add(key, action, behaviours[key][action]);
                    }, this.remove = function(name) {
                        this.$behaviours && this.$behaviours[name] && delete this.$behaviours[name];
                    }, this.inherit = function(mode, filter) {
                        if ("function" == typeof mode) var behaviours = new mode().getBehaviours(filter);
                        else var behaviours = mode.getBehaviours(filter);
                        this.addBehaviours(behaviours);
                    }, this.getBehaviours = function(filter) {
                        if (!filter) return this.$behaviours;
                        for(var ret = {}, i = 0; i < filter.length; i++)this.$behaviours[filter[i]] && (ret[filter[i]] = this.$behaviours[filter[i]]);
                        return ret;
                    };
                }).call(Behaviour.prototype), exports.Behaviour = Behaviour;
            }), ace.define("ace/token_iterator", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("./range").Range, TokenIterator = function(session, initialRow, initialColumn) {
                    this.$session = session, this.$row = initialRow, this.$rowTokens = session.getTokens(initialRow);
                    var token = session.getTokenAt(initialRow, initialColumn);
                    this.$tokenIndex = token ? token.index : -1;
                };
                (function() {
                    this.stepBackward = function() {
                        for(this.$tokenIndex -= 1; this.$tokenIndex < 0;){
                            if (this.$row -= 1, this.$row < 0) return this.$row = 0, null;
                            this.$rowTokens = this.$session.getTokens(this.$row), this.$tokenIndex = this.$rowTokens.length - 1;
                        }
                        return this.$rowTokens[this.$tokenIndex];
                    }, this.stepForward = function() {
                        var rowCount;
                        for(this.$tokenIndex += 1; this.$tokenIndex >= this.$rowTokens.length;){
                            if (this.$row += 1, rowCount || (rowCount = this.$session.getLength()), this.$row >= rowCount) return this.$row = rowCount - 1, null;
                            this.$rowTokens = this.$session.getTokens(this.$row), this.$tokenIndex = 0;
                        }
                        return this.$rowTokens[this.$tokenIndex];
                    }, this.getCurrentToken = function() {
                        return this.$rowTokens[this.$tokenIndex];
                    }, this.getCurrentTokenRow = function() {
                        return this.$row;
                    }, this.getCurrentTokenColumn = function() {
                        var rowTokens = this.$rowTokens, tokenIndex = this.$tokenIndex, column = rowTokens[tokenIndex].start;
                        if (void 0 !== column) return column;
                        for(column = 0; tokenIndex > 0;)tokenIndex -= 1, column += rowTokens[tokenIndex].value.length;
                        return column;
                    }, this.getCurrentTokenPosition = function() {
                        return {
                            row: this.$row,
                            column: this.getCurrentTokenColumn()
                        };
                    }, this.getCurrentTokenRange = function() {
                        var token = this.$rowTokens[this.$tokenIndex], column = this.getCurrentTokenColumn();
                        return new Range(this.$row, column, this.$row, column + token.value.length);
                    };
                }).call(TokenIterator.prototype), exports.TokenIterator = TokenIterator;
            }), ace.define("ace/mode/behaviour/cstyle", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/mode/behaviour",
                "ace/token_iterator",
                "ace/lib/lang"
            ], function(require, exports, module) {
                "use strict";
                var context, oop = require("../../lib/oop"), Behaviour = require("../behaviour").Behaviour, TokenIterator = require("../../token_iterator").TokenIterator, lang = require("../../lib/lang"), SAFE_INSERT_IN_TOKENS = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator"
                ], SAFE_INSERT_BEFORE_TOKENS = [
                    "text",
                    "paren.rparen",
                    "rparen",
                    "paren",
                    "punctuation.operator",
                    "comment"
                ], contextCache = {}, defaultQuotes = {
                    '"': '"',
                    "'": "'"
                }, initContext = function(editor) {
                    var id = -1;
                    if (editor.multiSelect && (id = editor.selection.index, contextCache.rangeCount != editor.multiSelect.rangeCount && (contextCache = {
                        rangeCount: editor.multiSelect.rangeCount
                    })), contextCache[id]) return context = contextCache[id];
                    context = contextCache[id] = {
                        autoInsertedBrackets: 0,
                        autoInsertedRow: -1,
                        autoInsertedLineEnd: "",
                        maybeInsertedBrackets: 0,
                        maybeInsertedRow: -1,
                        maybeInsertedLineStart: "",
                        maybeInsertedLineEnd: ""
                    };
                }, getWrapped = function(selection, selected, opening, closing) {
                    var rowDiff = selection.end.row - selection.start.row;
                    return {
                        text: opening + selected + closing,
                        selection: [
                            0,
                            selection.start.column + 1,
                            rowDiff,
                            selection.end.column + (rowDiff ? 0 : 1)
                        ]
                    };
                }, CstyleBehaviour = function(options) {
                    this.add("braces", "insertion", function(state, action, editor, session, text) {
                        var cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row);
                        if ("{" == text) {
                            initContext(editor);
                            var selection = editor.getSelectionRange(), selected = session.doc.getTextRange(selection);
                            if ("" !== selected && "{" !== selected && editor.getWrapBehavioursEnabled()) return getWrapped(selection, selected, "{", "}");
                            if (CstyleBehaviour.isSaneInsertion(editor, session)) return /[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode || options && options.braces ? (CstyleBehaviour.recordAutoInsert(editor, session, "}"), {
                                text: "{}",
                                selection: [
                                    1,
                                    1
                                ]
                            }) : (CstyleBehaviour.recordMaybeInsert(editor, session, "{"), {
                                text: "{",
                                selection: [
                                    1,
                                    1
                                ]
                            });
                        } else if ("}" == text) {
                            initContext(editor);
                            var rightChar = line.substring(cursor.column, cursor.column + 1);
                            if ("}" == rightChar && null !== session.$findOpeningBracket("}", {
                                column: cursor.column + 1,
                                row: cursor.row
                            }) && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) return CstyleBehaviour.popAutoInsertedClosing(), {
                                text: "",
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        } else if ("\n" == text || "\r\n" == text) {
                            initContext(editor);
                            var closing = "";
                            CstyleBehaviour.isMaybeInsertedClosing(cursor, line) && (closing = lang.stringRepeat("}", context.maybeInsertedBrackets), CstyleBehaviour.clearMaybeInsertedClosing());
                            var rightChar = line.substring(cursor.column, cursor.column + 1);
                            if ("}" === rightChar) {
                                var openBracePos = session.findMatchingBracket({
                                    row: cursor.row,
                                    column: cursor.column + 1
                                }, "}");
                                if (!openBracePos) return null;
                                var next_indent = this.$getIndent(session.getLine(openBracePos.row));
                            } else if (closing) var next_indent = this.$getIndent(line);
                            else {
                                CstyleBehaviour.clearMaybeInsertedClosing();
                                return;
                            }
                            var indent = next_indent + session.getTabString();
                            return {
                                text: "\n" + indent + "\n" + next_indent + closing,
                                selection: [
                                    1,
                                    indent.length,
                                    1,
                                    indent.length
                                ]
                            };
                        } else CstyleBehaviour.clearMaybeInsertedClosing();
                    }), this.add("braces", "deletion", function(state, action, editor, session, range) {
                        var selected = session.doc.getTextRange(range);
                        if (!range.isMultiLine() && "{" == selected) {
                            if (initContext(editor), "}" == session.doc.getLine(range.start.row).substring(range.end.column, range.end.column + 1)) return range.end.column++, range;
                            context.maybeInsertedBrackets--;
                        }
                    }), this.add("parens", "insertion", function(state, action, editor, session, text) {
                        if ("(" == text) {
                            initContext(editor);
                            var selection = editor.getSelectionRange(), selected = session.doc.getTextRange(selection);
                            if ("" !== selected && editor.getWrapBehavioursEnabled()) return getWrapped(selection, selected, "(", ")");
                            if (CstyleBehaviour.isSaneInsertion(editor, session)) return CstyleBehaviour.recordAutoInsert(editor, session, ")"), {
                                text: "()",
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        } else if (")" == text) {
                            initContext(editor);
                            var cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row);
                            if (")" == line.substring(cursor.column, cursor.column + 1) && null !== session.$findOpeningBracket(")", {
                                column: cursor.column + 1,
                                row: cursor.row
                            }) && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) return CstyleBehaviour.popAutoInsertedClosing(), {
                                text: "",
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        }
                    }), this.add("parens", "deletion", function(state, action, editor, session, range) {
                        var selected = session.doc.getTextRange(range);
                        if (!range.isMultiLine() && "(" == selected && (initContext(editor), ")" == session.doc.getLine(range.start.row).substring(range.start.column + 1, range.start.column + 2))) return range.end.column++, range;
                    }), this.add("brackets", "insertion", function(state, action, editor, session, text) {
                        if ("[" == text) {
                            initContext(editor);
                            var selection = editor.getSelectionRange(), selected = session.doc.getTextRange(selection);
                            if ("" !== selected && editor.getWrapBehavioursEnabled()) return getWrapped(selection, selected, "[", "]");
                            if (CstyleBehaviour.isSaneInsertion(editor, session)) return CstyleBehaviour.recordAutoInsert(editor, session, "]"), {
                                text: "[]",
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        } else if ("]" == text) {
                            initContext(editor);
                            var cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row);
                            if ("]" == line.substring(cursor.column, cursor.column + 1) && null !== session.$findOpeningBracket("]", {
                                column: cursor.column + 1,
                                row: cursor.row
                            }) && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) return CstyleBehaviour.popAutoInsertedClosing(), {
                                text: "",
                                selection: [
                                    1,
                                    1
                                ]
                            };
                        }
                    }), this.add("brackets", "deletion", function(state, action, editor, session, range) {
                        var selected = session.doc.getTextRange(range);
                        if (!range.isMultiLine() && "[" == selected && (initContext(editor), "]" == session.doc.getLine(range.start.row).substring(range.start.column + 1, range.start.column + 2))) return range.end.column++, range;
                    }), this.add("string_dquotes", "insertion", function(state, action, editor, session, text) {
                        var quotes = session.$mode.$quotes || defaultQuotes;
                        if (1 == text.length && quotes[text]) {
                            if (this.lineCommentStart && -1 != this.lineCommentStart.indexOf(text)) return;
                            initContext(editor);
                            var selection = editor.getSelectionRange(), selected = session.doc.getTextRange(selection);
                            if ("" !== selected && (1 != selected.length || !quotes[selected]) && editor.getWrapBehavioursEnabled()) return getWrapped(selection, selected, text, text);
                            if (!selected) {
                                var pair, cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row), leftChar = line.substring(cursor.column - 1, cursor.column), rightChar = line.substring(cursor.column, cursor.column + 1), token = session.getTokenAt(cursor.row, cursor.column), rightToken = session.getTokenAt(cursor.row, cursor.column + 1);
                                if ("\\" == leftChar && token && /escape/.test(token.type)) return null;
                                var stringBefore = token && /string|escape/.test(token.type), stringAfter = !rightToken || /string|escape/.test(rightToken.type);
                                if (rightChar == text) (pair = stringBefore !== stringAfter) && /string\.end/.test(rightToken.type) && (pair = !1);
                                else {
                                    if (stringBefore && !stringAfter || stringBefore && stringAfter) return null; // wrap string with different quote
                                    var wordRe = session.$mode.tokenRe;
                                    wordRe.lastIndex = 0;
                                    var isWordBefore = wordRe.test(leftChar);
                                    wordRe.lastIndex = 0;
                                    var isWordAfter = wordRe.test(leftChar);
                                    if (isWordBefore || isWordAfter || rightChar && !/[\s;,.})\]\\]/.test(rightChar)) return null; // before or after alphanumeric
                                    var charBefore = line[cursor.column - 2];
                                    if (leftChar == text && (charBefore == text || wordRe.test(charBefore))) return null;
                                    pair = !0;
                                }
                                return {
                                    text: pair ? text + text : "",
                                    selection: [
                                        1,
                                        1
                                    ]
                                };
                            }
                        }
                    }), this.add("string_dquotes", "deletion", function(state, action, editor, session, range) {
                        var quotes = session.$mode.$quotes || defaultQuotes, selected = session.doc.getTextRange(range);
                        if (!range.isMultiLine() && quotes.hasOwnProperty(selected) && (initContext(editor), session.doc.getLine(range.start.row).substring(range.start.column + 1, range.start.column + 2) == selected)) return range.end.column++, range;
                    });
                };
                CstyleBehaviour.isSaneInsertion = function(editor, session) {
                    var cursor = editor.getCursorPosition(), iterator = new TokenIterator(session, cursor.row, cursor.column);
                    if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
                        if (/[)}\]]/.test(editor.session.getLine(cursor.row)[cursor.column])) return !0;
                        var iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
                        if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) return !1;
                    }
                    return iterator.stepForward(), iterator.getCurrentTokenRow() !== cursor.row || this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
                }, CstyleBehaviour.$matchTokenType = function(token, types) {
                    return types.indexOf(token.type || token) > -1;
                }, CstyleBehaviour.recordAutoInsert = function(editor, session, bracket) {
                    var cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row);
                    this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0]) || (context.autoInsertedBrackets = 0), context.autoInsertedRow = cursor.row, context.autoInsertedLineEnd = bracket + line.substr(cursor.column), context.autoInsertedBrackets++;
                }, CstyleBehaviour.recordMaybeInsert = function(editor, session, bracket) {
                    var cursor = editor.getCursorPosition(), line = session.doc.getLine(cursor.row);
                    this.isMaybeInsertedClosing(cursor, line) || (context.maybeInsertedBrackets = 0), context.maybeInsertedRow = cursor.row, context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket, context.maybeInsertedLineEnd = line.substr(cursor.column), context.maybeInsertedBrackets++;
                }, CstyleBehaviour.isAutoInsertedClosing = function(cursor, line, bracket) {
                    return context.autoInsertedBrackets > 0 && cursor.row === context.autoInsertedRow && bracket === context.autoInsertedLineEnd[0] && line.substr(cursor.column) === context.autoInsertedLineEnd;
                }, CstyleBehaviour.isMaybeInsertedClosing = function(cursor, line) {
                    return context.maybeInsertedBrackets > 0 && cursor.row === context.maybeInsertedRow && line.substr(cursor.column) === context.maybeInsertedLineEnd && line.substr(0, cursor.column) == context.maybeInsertedLineStart;
                }, CstyleBehaviour.popAutoInsertedClosing = function() {
                    context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1), context.autoInsertedBrackets--;
                }, CstyleBehaviour.clearMaybeInsertedClosing = function() {
                    context && (context.maybeInsertedBrackets = 0, context.maybeInsertedRow = -1);
                }, oop.inherits(CstyleBehaviour, Behaviour), exports.CstyleBehaviour = CstyleBehaviour;
            }), ace.define("ace/unicode", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                for(var wordChars = [
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
                    2
                ], code = 0, str = [], i = 0; i < wordChars.length; i += 2)str.push(code += wordChars[i]), wordChars[i + 1] && str.push(45, code += wordChars[i + 1]);
                exports.wordChars = String.fromCharCode.apply(null, str);
            }), ace.define("ace/mode/text", [
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
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var config = require("../config"), Tokenizer = require("../tokenizer").Tokenizer, TextHighlightRules = require("./text_highlight_rules").TextHighlightRules, CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour, unicode = require("../unicode"), lang = require("../lib/lang"), TokenIterator = require("../token_iterator").TokenIterator, Range = require("../range").Range, Mode = function() {
                    this.HighlightRules = TextHighlightRules;
                };
                (function() {
                    this.$defaultBehaviour = new CstyleBehaviour(), this.tokenRe = RegExp("^[" + unicode.wordChars + "\\$_]+", "g"), this.nonTokenRe = RegExp("^(?:[^" + unicode.wordChars + "\\$_]|\\s])+", "g"), this.getTokenizer = function() {
                        return this.$tokenizer || (this.$highlightRules = this.$highlightRules || new this.HighlightRules(this.$highlightRuleConfig), this.$tokenizer = new Tokenizer(this.$highlightRules.getRules())), this.$tokenizer;
                    }, this.lineCommentStart = "", this.blockComment = "", this.toggleCommentLines = function(state, session, startRow, endRow) {
                        var doc = session.doc, ignoreBlankLines = !0, shouldRemove = !0, minIndent = 1 / 0, tabSize = session.getTabSize(), insertAtTabStop = !1;
                        if (this.lineCommentStart) {
                            if (Array.isArray(this.lineCommentStart)) var regexpStart = this.lineCommentStart.map(lang.escapeRegExp).join("|"), lineCommentStart = this.lineCommentStart[0];
                            else var regexpStart = lang.escapeRegExp(this.lineCommentStart), lineCommentStart = this.lineCommentStart;
                            regexpStart = RegExp("^(\\s*)(?:" + regexpStart + ") ?"), insertAtTabStop = session.getUseSoftTabs();
                            var uncomment = function(line, i) {
                                var m = line.match(regexpStart);
                                if (m) {
                                    var start = m[1].length, end = m[0].length;
                                    !shouldInsertSpace(line, start, end) && " " == m[0][end - 1] && end--, doc.removeInLine(i, start, end);
                                }
                            }, commentWithSpace = lineCommentStart + " ", comment = function(line, i) {
                                (!ignoreBlankLines || /\S/.test(line)) && (shouldInsertSpace(line, minIndent, minIndent) ? doc.insertInLine({
                                    row: i,
                                    column: minIndent
                                }, commentWithSpace) : doc.insertInLine({
                                    row: i,
                                    column: minIndent
                                }, lineCommentStart));
                            }, testRemove = function(line, i) {
                                return regexpStart.test(line);
                            }, shouldInsertSpace = function(line, before, after) {
                                for(var spaces = 0; before-- && " " == line.charAt(before);)spaces++;
                                if (spaces % tabSize != 0) return !1;
                                for(var spaces = 0; " " == line.charAt(after++);)spaces++;
                                return tabSize > 2 ? spaces % tabSize != tabSize - 1 : spaces % tabSize == 0;
                            };
                        } else {
                            if (!this.blockComment) return !1;
                            var lineCommentStart = this.blockComment.start, lineCommentEnd = this.blockComment.end, regexpStart = RegExp("^(\\s*)(?:" + lang.escapeRegExp(lineCommentStart) + ")"), regexpEnd = RegExp("(?:" + lang.escapeRegExp(lineCommentEnd) + ")\\s*$"), comment = function(line, i) {
                                !testRemove(line, i) && (!ignoreBlankLines || /\S/.test(line)) && (doc.insertInLine({
                                    row: i,
                                    column: line.length
                                }, lineCommentEnd), doc.insertInLine({
                                    row: i,
                                    column: minIndent
                                }, lineCommentStart));
                            }, uncomment = function(line, i) {
                                var m;
                                (m = line.match(regexpEnd)) && doc.removeInLine(i, line.length - m[0].length, line.length), (m = line.match(regexpStart)) && doc.removeInLine(i, m[1].length, m[0].length);
                            }, testRemove = function(line, row) {
                                if (regexpStart.test(line)) return !0;
                                for(var tokens = session.getTokens(row), i = 0; i < tokens.length; i++)if ("comment" === tokens[i].type) return !0;
                            };
                        }
                        function iter(fun) {
                            for(var i = startRow; i <= endRow; i++)fun(doc.getLine(i), i);
                        }
                        var minEmptyLength = 1 / 0;
                        iter(function(line, i) {
                            var indent = line.search(/\S/);
                            -1 !== indent ? (indent < minIndent && (minIndent = indent), shouldRemove && !testRemove(line, i) && (shouldRemove = !1)) : minEmptyLength > line.length && (minEmptyLength = line.length);
                        }), minIndent == 1 / 0 && (minIndent = minEmptyLength, ignoreBlankLines = !1, shouldRemove = !1), insertAtTabStop && minIndent % tabSize != 0 && (minIndent = Math.floor(minIndent / tabSize) * tabSize), iter(shouldRemove ? uncomment : comment);
                    }, this.toggleBlockComment = function(state, session, range, cursor) {
                        var comment = this.blockComment;
                        if (comment) {
                            !comment.start && comment[0] && (comment = comment[0]);
                            var iterator = new TokenIterator(session, cursor.row, cursor.column), token = iterator.getCurrentToken();
                            session.selection;
                            var initialRange = session.selection.toOrientedRange();
                            if (token && /comment/.test(token.type)) {
                                for(; token && /comment/.test(token.type);){
                                    var startRow, colDiff, startRange, endRange, i = token.value.indexOf(comment.start);
                                    if (-1 != i) {
                                        var row = iterator.getCurrentTokenRow(), column = iterator.getCurrentTokenColumn() + i;
                                        startRange = new Range(row, column, row, column + comment.start.length);
                                        break;
                                    }
                                    token = iterator.stepBackward();
                                }
                                for(var iterator = new TokenIterator(session, cursor.row, cursor.column), token = iterator.getCurrentToken(); token && /comment/.test(token.type);){
                                    var i = token.value.indexOf(comment.end);
                                    if (-1 != i) {
                                        var row = iterator.getCurrentTokenRow(), column = iterator.getCurrentTokenColumn() + i;
                                        endRange = new Range(row, column, row, column + comment.end.length);
                                        break;
                                    }
                                    token = iterator.stepForward();
                                }
                                endRange && session.remove(endRange), startRange && (session.remove(startRange), startRow = startRange.start.row, colDiff = -comment.start.length);
                            } else colDiff = comment.start.length, startRow = range.start.row, session.insert(range.end, comment.end), session.insert(range.start, comment.start);
                            initialRange.start.row == startRow && (initialRange.start.column += colDiff), initialRange.end.row == startRow && (initialRange.end.column += colDiff), session.selection.fromOrientedRange(initialRange);
                        }
                    }, this.getNextLineIndent = function(state, line, tab) {
                        return this.$getIndent(line);
                    }, this.checkOutdent = function(state, line, input) {
                        return !1;
                    }, this.autoOutdent = function(state, doc, row) {}, this.$getIndent = function(line) {
                        return line.match(/^\s*/)[0];
                    }, this.createWorker = function(session) {
                        return null;
                    }, this.createModeDelegates = function(mapping) {
                        for(var i in this.$embeds = [], this.$modes = {}, mapping)if (mapping[i]) {
                            var Mode = mapping[i], id = Mode.prototype.$id, mode = config.$modes[id];
                            mode || (config.$modes[id] = mode = new Mode()), config.$modes[i] || (config.$modes[i] = mode), this.$embeds.push(i), this.$modes[i] = mode;
                        }
                        for(var delegations = [
                            "toggleBlockComment",
                            "toggleCommentLines",
                            "getNextLineIndent",
                            "checkOutdent",
                            "autoOutdent",
                            "transformAction",
                            "getCompletions"
                        ], i = 0; i < delegations.length; i++)!function(scope) {
                            var functionName = delegations[i], defaultHandler = scope[functionName];
                            scope[delegations[i]] = function() {
                                return this.$delegator(functionName, arguments, defaultHandler);
                            };
                        }(this);
                    }, this.$delegator = function(method, args, defaultHandler) {
                        var state = args[0] || "start";
                        if ("string" != typeof state) {
                            if (Array.isArray(state[2])) {
                                var language = state[2][state[2].length - 1], mode = this.$modes[language];
                                if (mode) return mode[method].apply(mode, [
                                    state[1]
                                ].concat([].slice.call(args, 1)));
                            }
                            state = state[0] || "start";
                        }
                        for(var i = 0; i < this.$embeds.length; i++)if (this.$modes[this.$embeds[i]]) {
                            var split = state.split(this.$embeds[i]);
                            if (!split[0] && split[1]) {
                                args[0] = split[1];
                                var mode = this.$modes[this.$embeds[i]];
                                return mode[method].apply(mode, args);
                            }
                        }
                        var ret = defaultHandler.apply(this, args);
                        return defaultHandler ? ret : void 0;
                    }, this.transformAction = function(state, action, editor, session, param) {
                        if (this.$behaviour) {
                            var behaviours = this.$behaviour.getBehaviours();
                            for(var key in behaviours)if (behaviours[key][action]) {
                                var ret = behaviours[key][action].apply(this, arguments);
                                if (ret) return ret;
                            }
                        }
                    }, this.getKeywords = function(append) {
                        if (!this.completionKeywords) {
                            var rules = this.$tokenizer.rules, completionKeywords = [];
                            for(var rule in rules)for(var ruleItr = rules[rule], r = 0, l = ruleItr.length; r < l; r++)if ("string" == typeof ruleItr[r].token) /keyword|support|storage/.test(ruleItr[r].token) && completionKeywords.push(ruleItr[r].regex);
                            else if ("object" == typeof ruleItr[r].token) {
                                for(var a = 0, aLength = ruleItr[r].token.length; a < aLength; a++)if (/keyword|support|storage/.test(ruleItr[r].token[a])) {
                                    var rule = ruleItr[r].regex.match(/\(.+?\)/g)[a];
                                    completionKeywords.push(rule.substr(1, rule.length - 2));
                                }
                            }
                            this.completionKeywords = completionKeywords;
                        }
                        return append ? completionKeywords.concat(this.$keywordList || []) : this.$keywordList;
                    }, this.$createKeywordList = function() {
                        return this.$highlightRules || this.getTokenizer(), this.$keywordList = this.$highlightRules.$keywordList || [];
                    }, this.getCompletions = function(state, session, pos, prefix) {
                        return (this.$keywordList || this.$createKeywordList()).map(function(word) {
                            return {
                                name: word,
                                value: word,
                                score: 0,
                                meta: "keyword"
                            };
                        });
                    }, this.$id = "ace/mode/text";
                }).call(Mode.prototype), exports.Mode = Mode;
            }), ace.define("ace/apply_delta", [
                "require",
                "exports",
                "module"
            ], function(require, exports, module) {
                "use strict";
                exports.applyDelta = function(docLines, delta, doNotValidate) {
                    var row = delta.start.row, startColumn = delta.start.column, line = docLines[row] || "";
                    switch(delta.action){
                        case "insert":
                            if (1 === delta.lines.length) docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
                            else {
                                var args = [
                                    row,
                                    1
                                ].concat(delta.lines);
                                docLines.splice.apply(docLines, args), docLines[row] = line.substring(0, startColumn) + docLines[row], docLines[row + delta.lines.length - 1] += line.substring(startColumn);
                            }
                            break;
                        case "remove":
                            var endColumn = delta.end.column, endRow = delta.end.row;
                            row === endRow ? docLines[row] = line.substring(0, startColumn) + line.substring(endColumn) : docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
                    }
                };
            }), ace.define("ace/anchor", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), EventEmitter = require("./lib/event_emitter").EventEmitter;
                (function() {
                    function $pointsInOrder(point1, point2, equalPointsInOrder) {
                        var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
                        return point1.row < point2.row || point1.row == point2.row && bColIsAfter;
                    }
                    oop.implement(this, EventEmitter), this.getPosition = function() {
                        return this.$clipPositionToDocument(this.row, this.column);
                    }, this.getDocument = function() {
                        return this.document;
                    }, this.$insertRight = !1, this.onChange = function(delta) {
                        if ((delta.start.row != delta.end.row || delta.start.row == this.row) && !(delta.start.row > this.row)) {
                            var point, moveIfEqual, deltaIsInsert, deltaRowShift, deltaColShift, deltaStart, deltaEnd, point1 = (point = {
                                row: this.row,
                                column: this.column
                            }, moveIfEqual = this.$insertRight, deltaRowShift = ((deltaIsInsert = "insert" == delta.action) ? 1 : -1) * (delta.end.row - delta.start.row), deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column), deltaStart = delta.start, deltaEnd = deltaIsInsert ? deltaStart : delta.end, $pointsInOrder(point, deltaStart, moveIfEqual) ? {
                                row: point.row,
                                column: point.column
                            } : $pointsInOrder(deltaEnd, point, !moveIfEqual) ? {
                                row: point.row + deltaRowShift,
                                column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
                            } : {
                                row: deltaStart.row,
                                column: deltaStart.column
                            });
                            this.setPosition(point1.row, point1.column, !0);
                        }
                    }, this.setPosition = function(row, column, noClip) {
                        if (pos = noClip ? {
                            row: row,
                            column: column
                        } : this.$clipPositionToDocument(row, column), this.row != pos.row || this.column != pos.column) {
                            var pos, old = {
                                row: this.row,
                                column: this.column
                            };
                            this.row = pos.row, this.column = pos.column, this._signal("change", {
                                old: old,
                                value: pos
                            });
                        }
                    }, this.detach = function() {
                        this.document.off("change", this.$onChange);
                    }, this.attach = function(doc) {
                        this.document = doc || this.document, this.document.on("change", this.$onChange);
                    }, this.$clipPositionToDocument = function(row, column) {
                        var pos = {};
                        return row >= this.document.getLength() ? (pos.row = Math.max(0, this.document.getLength() - 1), pos.column = this.document.getLine(pos.row).length) : row < 0 ? (pos.row = 0, pos.column = 0) : (pos.row = row, pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column))), column < 0 && (pos.column = 0), pos;
                    };
                }).call((exports.Anchor = function(doc, row, column) {
                    this.$onChange = this.onChange.bind(this), this.attach(doc), void 0 === column ? this.setPosition(row.row, row.column) : this.setPosition(row, column);
                }).prototype);
            }), ace.define("ace/document", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/apply_delta",
                "ace/lib/event_emitter",
                "ace/range",
                "ace/anchor"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), applyDelta = require("./apply_delta").applyDelta, EventEmitter = require("./lib/event_emitter").EventEmitter, Range = require("./range").Range, Anchor = require("./anchor").Anchor, Document = function(textOrLines) {
                    this.$lines = [
                        ""
                    ], 0 === textOrLines.length ? this.$lines = [
                        ""
                    ] : Array.isArray(textOrLines) ? this.insertMergedLines({
                        row: 0,
                        column: 0
                    }, textOrLines) : this.insert({
                        row: 0,
                        column: 0
                    }, textOrLines);
                };
                (function() {
                    oop.implement(this, EventEmitter), this.setValue = function(text) {
                        var len = this.getLength() - 1;
                        this.remove(new Range(0, 0, len, this.getLine(len).length)), this.insert({
                            row: 0,
                            column: 0
                        }, text);
                    }, this.getValue = function() {
                        return this.getAllLines().join(this.getNewLineCharacter());
                    }, this.createAnchor = function(row, column) {
                        return new Anchor(this, row, column);
                    }, 0 === "aaa".split(/a/).length ? this.$split = function(text) {
                        return text.replace(/\r\n|\r/g, "\n").split("\n");
                    } : this.$split = function(text) {
                        return text.split(/\r\n|\r|\n/);
                    }, this.$detectNewLine = function(text) {
                        var match = text.match(/^.*?(\r\n|\r|\n)/m);
                        this.$autoNewLine = match ? match[1] : "\n", this._signal("changeNewLineMode");
                    }, this.getNewLineCharacter = function() {
                        switch(this.$newLineMode){
                            case "windows":
                                return "\r\n";
                            case "unix":
                                return "\n";
                            default:
                                return this.$autoNewLine || "\n";
                        }
                    }, this.$autoNewLine = "", this.$newLineMode = "auto", this.setNewLineMode = function(newLineMode) {
                        this.$newLineMode !== newLineMode && (this.$newLineMode = newLineMode, this._signal("changeNewLineMode"));
                    }, this.getNewLineMode = function() {
                        return this.$newLineMode;
                    }, this.isNewLine = function(text) {
                        return "\r\n" == text || "\r" == text || "\n" == text;
                    }, this.getLine = function(row) {
                        return this.$lines[row] || "";
                    }, this.getLines = function(firstRow, lastRow) {
                        return this.$lines.slice(firstRow, lastRow + 1);
                    }, this.getAllLines = function() {
                        return this.getLines(0, this.getLength());
                    }, this.getLength = function() {
                        return this.$lines.length;
                    }, this.getTextRange = function(range) {
                        return this.getLinesForRange(range).join(this.getNewLineCharacter());
                    }, this.getLinesForRange = function(range) {
                        var lines;
                        if (range.start.row === range.end.row) lines = [
                            this.getLine(range.start.row).substring(range.start.column, range.end.column)
                        ];
                        else {
                            (lines = this.getLines(range.start.row, range.end.row))[0] = (lines[0] || "").substring(range.start.column);
                            var l = lines.length - 1;
                            range.end.row - range.start.row == l && (lines[l] = lines[l].substring(0, range.end.column));
                        }
                        return lines;
                    }, this.insertLines = function(row, lines) {
                        return console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead."), this.insertFullLines(row, lines);
                    }, this.removeLines = function(firstRow, lastRow) {
                        return console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead."), this.removeFullLines(firstRow, lastRow);
                    }, this.insertNewLine = function(position) {
                        return console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."), this.insertMergedLines(position, [
                            "",
                            ""
                        ]);
                    }, this.insert = function(position, text) {
                        return 1 >= this.getLength() && this.$detectNewLine(text), this.insertMergedLines(position, this.$split(text));
                    }, this.insertInLine = function(position, text) {
                        var start = this.clippedPos(position.row, position.column), end = this.pos(position.row, position.column + text.length);
                        return this.applyDelta({
                            start: start,
                            end: end,
                            action: "insert",
                            lines: [
                                text
                            ]
                        }, !0), this.clonePos(end);
                    }, this.clippedPos = function(row, column) {
                        var length = this.getLength();
                        void 0 === row ? row = length : row < 0 ? row = 0 : row >= length && (row = length - 1, column = void 0);
                        var line = this.getLine(row);
                        return void 0 == column && (column = line.length), {
                            row: row,
                            column: column = Math.min(Math.max(column, 0), line.length)
                        };
                    }, this.clonePos = function(pos) {
                        return {
                            row: pos.row,
                            column: pos.column
                        };
                    }, this.pos = function(row, column) {
                        return {
                            row: row,
                            column: column
                        };
                    }, this.$clipPosition = function(position) {
                        var length = this.getLength();
                        return position.row >= length ? (position.row = Math.max(0, length - 1), position.column = this.getLine(length - 1).length) : (position.row = Math.max(0, position.row), position.column = Math.min(Math.max(position.column, 0), this.getLine(position.row).length)), position;
                    }, this.insertFullLines = function(row, lines) {
                        row = Math.min(Math.max(row, 0), this.getLength());
                        var column = 0;
                        row < this.getLength() ? (lines = lines.concat([
                            ""
                        ]), column = 0) : (lines = [
                            ""
                        ].concat(lines), row--, column = this.$lines[row].length), this.insertMergedLines({
                            row: row,
                            column: column
                        }, lines);
                    }, this.insertMergedLines = function(position, lines) {
                        var start = this.clippedPos(position.row, position.column), end = {
                            row: start.row + lines.length - 1,
                            column: (1 == lines.length ? start.column : 0) + lines[lines.length - 1].length
                        };
                        return this.applyDelta({
                            start: start,
                            end: end,
                            action: "insert",
                            lines: lines
                        }), this.clonePos(end);
                    }, this.remove = function(range) {
                        var start = this.clippedPos(range.start.row, range.start.column), end = this.clippedPos(range.end.row, range.end.column);
                        return this.applyDelta({
                            start: start,
                            end: end,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: start,
                                end: end
                            })
                        }), this.clonePos(start);
                    }, this.removeInLine = function(row, startColumn, endColumn) {
                        var start = this.clippedPos(row, startColumn), end = this.clippedPos(row, endColumn);
                        return this.applyDelta({
                            start: start,
                            end: end,
                            action: "remove",
                            lines: this.getLinesForRange({
                                start: start,
                                end: end
                            })
                        }, !0), this.clonePos(start);
                    }, this.removeFullLines = function(firstRow, lastRow) {
                        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
                        var deleteFirstNewLine = (lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1)) == this.getLength() - 1 && firstRow > 0, deleteLastNewLine = lastRow < this.getLength() - 1, startRow = deleteFirstNewLine ? firstRow - 1 : firstRow, startCol = deleteFirstNewLine ? this.getLine(startRow).length : 0, endRow = deleteLastNewLine ? lastRow + 1 : lastRow, endCol = deleteLastNewLine ? 0 : this.getLine(endRow).length, range = new Range(startRow, startCol, endRow, endCol), deletedLines = this.$lines.slice(firstRow, lastRow + 1);
                        return this.applyDelta({
                            start: range.start,
                            end: range.end,
                            action: "remove",
                            lines: this.getLinesForRange(range)
                        }), deletedLines;
                    }, this.removeNewLine = function(row) {
                        row < this.getLength() - 1 && row >= 0 && this.applyDelta({
                            start: this.pos(row, this.getLine(row).length),
                            end: this.pos(row + 1, 0),
                            action: "remove",
                            lines: [
                                "",
                                ""
                            ]
                        });
                    }, this.replace = function(range, text) {
                        return (range instanceof Range || (range = Range.fromPoints(range.start, range.end)), 0 === text.length && range.isEmpty()) ? range.start : text == this.getTextRange(range) ? range.end : (this.remove(range), text ? this.insert(range.start, text) : range.start);
                    }, this.applyDeltas = function(deltas) {
                        for(var i = 0; i < deltas.length; i++)this.applyDelta(deltas[i]);
                    }, this.revertDeltas = function(deltas) {
                        for(var i = deltas.length - 1; i >= 0; i--)this.revertDelta(deltas[i]);
                    }, this.applyDelta = function(delta, doNotValidate) {
                        var isInsert = "insert" == delta.action;
                        (isInsert ? !(delta.lines.length <= 1) || delta.lines[0] : Range.comparePoints(delta.start, delta.end)) && (isInsert && delta.lines.length > 20000 ? this.$splitAndapplyLargeDelta(delta, 20000) : (applyDelta(this.$lines, delta, doNotValidate), this._signal("change", delta)));
                    }, this.$safeApplyDelta = function(delta) {
                        var docLength = this.$lines.length;
                        ("remove" == delta.action && delta.start.row < docLength && delta.end.row < docLength || "insert" == delta.action && delta.start.row <= docLength) && this.applyDelta(delta);
                    }, this.$splitAndapplyLargeDelta = function(delta, MAX) {
                        for(var lines = delta.lines, l = lines.length - MAX + 1, row = delta.start.row, column = delta.start.column, from = 0, to = 0; from < l; from = to){
                            to += MAX - 1;
                            var chunk = lines.slice(from, to);
                            chunk.push(""), this.applyDelta({
                                start: this.pos(row + from, column),
                                end: this.pos(row + to, column = 0),
                                action: delta.action,
                                lines: chunk
                            }, !0);
                        }
                        delta.lines = lines.slice(from), delta.start.row = row + from, delta.start.column = column, this.applyDelta(delta, !0);
                    }, this.revertDelta = function(delta) {
                        this.$safeApplyDelta({
                            start: this.clonePos(delta.start),
                            end: this.clonePos(delta.end),
                            action: "insert" == delta.action ? "remove" : "insert",
                            lines: delta.lines.slice()
                        });
                    }, this.indexToPosition = function(index, startRow) {
                        for(var lines = this.$lines || this.getAllLines(), newlineLength = this.getNewLineCharacter().length, i = startRow || 0, l = lines.length; i < l; i++)if ((index -= lines[i].length + newlineLength) < 0) return {
                            row: i,
                            column: index + lines[i].length + newlineLength
                        };
                        return {
                            row: l - 1,
                            column: index + lines[l - 1].length + newlineLength
                        };
                    }, this.positionToIndex = function(pos, startRow) {
                        for(var lines = this.$lines || this.getAllLines(), newlineLength = this.getNewLineCharacter().length, index = 0, row = Math.min(pos.row, lines.length), i = startRow || 0; i < row; ++i)index += lines[i].length + newlineLength;
                        return index + pos.column;
                    };
                }).call(Document.prototype), exports.Document = Document;
            }), ace.define("ace/background_tokenizer", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), EventEmitter = require("./lib/event_emitter").EventEmitter, BackgroundTokenizer = function(tokenizer, editor) {
                    this.running = !1, this.lines = [], this.states = [], this.currentLine = 0, this.tokenizer = tokenizer;
                    var self1 = this;
                    this.$worker = function() {
                        if (self1.running) {
                            for(var workerStart = new Date(), currentLine = self1.currentLine, endLine = -1, doc = self1.doc, startLine = currentLine; self1.lines[currentLine];)currentLine++;
                            var len = doc.getLength(), processedLines = 0;
                            for(self1.running = !1; currentLine < len;){
                                self1.$tokenizeRow(currentLine), endLine = currentLine;
                                do currentLine++;
                                while (self1.lines[currentLine])
                                if (++processedLines % 5 == 0 && new Date() - workerStart > 20) {
                                    self1.running = setTimeout(self1.$worker, 20);
                                    break;
                                }
                            }
                            self1.currentLine = currentLine, -1 == endLine && (endLine = currentLine), startLine <= endLine && self1.fireUpdateEvent(startLine, endLine);
                        }
                    };
                };
                (function() {
                    oop.implement(this, EventEmitter), this.setTokenizer = function(tokenizer) {
                        this.tokenizer = tokenizer, this.lines = [], this.states = [], this.start(0);
                    }, this.setDocument = function(doc) {
                        this.doc = doc, this.lines = [], this.states = [], this.stop();
                    }, this.fireUpdateEvent = function(firstRow, lastRow) {
                        this._signal("update", {
                            data: {
                                first: firstRow,
                                last: lastRow
                            }
                        });
                    }, this.start = function(startRow) {
                        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength()), this.lines.splice(this.currentLine, this.lines.length), this.states.splice(this.currentLine, this.states.length), this.stop(), this.running = setTimeout(this.$worker, 700);
                    }, this.scheduleStart = function() {
                        this.running || (this.running = setTimeout(this.$worker, 700));
                    }, this.$updateOnChange = function(delta) {
                        var startRow = delta.start.row, len = delta.end.row - startRow;
                        if (0 === len) this.lines[startRow] = null;
                        else if ("remove" == delta.action) this.lines.splice(startRow, len + 1, null), this.states.splice(startRow, len + 1, null);
                        else {
                            var args = Array(len + 1);
                            args.unshift(startRow, 1), this.lines.splice.apply(this.lines, args), this.states.splice.apply(this.states, args);
                        }
                        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength()), this.stop();
                    }, this.stop = function() {
                        this.running && clearTimeout(this.running), this.running = !1;
                    }, this.getTokens = function(row) {
                        return this.lines[row] || this.$tokenizeRow(row);
                    }, this.getState = function(row) {
                        return this.currentLine == row && this.$tokenizeRow(row), this.states[row] || "start";
                    }, this.$tokenizeRow = function(row) {
                        var line = this.doc.getLine(row), state = this.states[row - 1], data = this.tokenizer.getLineTokens(line, state, row);
                        return this.states[row] + "" != data.state + "" ? (this.states[row] = data.state, this.lines[row + 1] = null, this.currentLine > row + 1 && (this.currentLine = row + 1)) : this.currentLine == row && (this.currentLine = row + 1), this.lines[row] = data.tokens;
                    };
                }).call(BackgroundTokenizer.prototype), exports.BackgroundTokenizer = BackgroundTokenizer;
            }), ace.define("ace/search_highlight", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var lang = require("./lib/lang");
                require("./lib/oop");
                var Range = require("./range").Range, SearchHighlight = function(regExp, clazz, type) {
                    this.setRegexp(regExp), this.clazz = clazz, this.type = type || "text";
                };
                (function() {
                    this.MAX_RANGES = 500, this.setRegexp = function(regExp) {
                        this.regExp + "" != regExp + "" && (this.regExp = regExp, this.cache = []);
                    }, this.update = function(html, markerLayer, session, config) {
                        if (this.regExp) for(var start = config.firstRow, end = config.lastRow, i = start; i <= end; i++){
                            var ranges = this.cache[i];
                            null == ranges && ((ranges = lang.getMatchOffsets(session.getLine(i), this.regExp)).length > this.MAX_RANGES && (ranges = ranges.slice(0, this.MAX_RANGES)), ranges = ranges.map(function(match) {
                                return new Range(i, match.offset, i, match.offset + match.length);
                            }), this.cache[i] = ranges.length ? ranges : "");
                            for(var j = ranges.length; j--;)markerLayer.drawSingleLineMarker(html, ranges[j].toScreenRange(session), this.clazz, config);
                        }
                    };
                }).call(SearchHighlight.prototype), exports.SearchHighlight = SearchHighlight;
            }), ace.define("ace/edit_session/fold_line", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("../range").Range;
                function FoldLine(foldData, folds) {
                    this.foldData = foldData, Array.isArray(folds) ? this.folds = folds : folds = this.folds = [
                        folds
                    ];
                    var last = folds[folds.length - 1];
                    this.range = new Range(folds[0].start.row, folds[0].start.column, last.end.row, last.end.column), this.start = this.range.start, this.end = this.range.end, this.folds.forEach(function(fold) {
                        fold.setFoldLine(this);
                    }, this);
                }
                (function() {
                    this.shiftRow = function(shift) {
                        this.start.row += shift, this.end.row += shift, this.folds.forEach(function(fold) {
                            fold.start.row += shift, fold.end.row += shift;
                        });
                    }, this.addFold = function(fold) {
                        if (fold.sameRow) {
                            if (fold.start.row < this.startRow || fold.endRow > this.endRow) throw Error("Can't add a fold to this FoldLine as it has no connection");
                            this.folds.push(fold), this.folds.sort(function(a, b) {
                                return -a.range.compareEnd(b.start.row, b.start.column);
                            }), this.range.compareEnd(fold.start.row, fold.start.column) > 0 ? (this.end.row = fold.end.row, this.end.column = fold.end.column) : 0 > this.range.compareStart(fold.end.row, fold.end.column) && (this.start.row = fold.start.row, this.start.column = fold.start.column);
                        } else if (fold.start.row == this.end.row) this.folds.push(fold), this.end.row = fold.end.row, this.end.column = fold.end.column;
                        else if (fold.end.row == this.start.row) this.folds.unshift(fold), this.start.row = fold.start.row, this.start.column = fold.start.column;
                        else throw Error("Trying to add fold to FoldRow that doesn't have a matching row");
                        fold.foldLine = this;
                    }, this.containsRow = function(row) {
                        return row >= this.start.row && row <= this.end.row;
                    }, this.walk = function(callback, endRow, endColumn) {
                        var fold, cmp, lastEnd = 0, folds = this.folds, isNewRow = !0;
                        null == endRow && (endRow = this.end.row, endColumn = this.end.column);
                        for(var i = 0; i < folds.length; i++){
                            if (-1 == (cmp = (fold = folds[i]).range.compareStart(endRow, endColumn))) {
                                callback(null, endRow, endColumn, lastEnd, isNewRow);
                                return;
                            }
                            if (!callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow) && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd) || 0 === cmp) return;
                            isNewRow = !fold.sameRow, lastEnd = fold.end.column;
                        }
                        callback(null, endRow, endColumn, lastEnd, isNewRow);
                    }, this.getNextFoldTo = function(row, column) {
                        for(var fold, cmp, i = 0; i < this.folds.length; i++){
                            if (-1 == (cmp = (fold = this.folds[i]).range.compareEnd(row, column))) return {
                                fold: fold,
                                kind: "after"
                            };
                            if (0 === cmp) return {
                                fold: fold,
                                kind: "inside"
                            };
                        }
                        return null;
                    }, this.addRemoveChars = function(row, column, len) {
                        var fold, folds, ret = this.getNextFoldTo(row, column);
                        if (ret) {
                            if (fold = ret.fold, "inside" == ret.kind && fold.start.column != column && fold.start.row != row) window.console && window.console.log(row, column, fold);
                            else if (fold.start.row == row) {
                                var i = (folds = this.folds).indexOf(fold);
                                for(0 === i && (this.start.column += len); i < folds.length; i++){
                                    if (fold = folds[i], fold.start.column += len, !fold.sameRow) return;
                                    fold.end.column += len;
                                }
                                this.end.column += len;
                            }
                        }
                    }, this.split = function(row, column) {
                        var pos = this.getNextFoldTo(row, column);
                        if (!pos || "inside" == pos.kind) return null;
                        var fold = pos.fold, folds = this.folds, foldData = this.foldData, i = folds.indexOf(fold), foldBefore = folds[i - 1];
                        this.end.row = foldBefore.end.row, this.end.column = foldBefore.end.column;
                        var newFoldLine = new FoldLine(foldData, folds = folds.splice(i, folds.length - i));
                        return foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine), newFoldLine;
                    }, this.merge = function(foldLineNext) {
                        for(var folds = foldLineNext.folds, i = 0; i < folds.length; i++)this.addFold(folds[i]);
                        var foldData = this.foldData;
                        foldData.splice(foldData.indexOf(foldLineNext), 1);
                    }, this.toString = function() {
                        var ret = [
                            this.range.toString() + ": ["
                        ];
                        return this.folds.forEach(function(fold) {
                            ret.push("  " + fold.toString());
                        }), ret.push("]"), ret.join("\n");
                    }, this.idxToPosition = function(idx) {
                        for(var lastFoldEndColumn = 0, i = 0; i < this.folds.length; i++){
                            var fold = this.folds[i];
                            if ((idx -= fold.start.column - lastFoldEndColumn) < 0) return {
                                row: fold.start.row,
                                column: fold.start.column + idx
                            };
                            if ((idx -= fold.placeholder.length) < 0) return fold.start;
                            lastFoldEndColumn = fold.end.column;
                        }
                        return {
                            row: this.end.row,
                            column: this.end.column + idx
                        };
                    };
                }).call(FoldLine.prototype), exports.FoldLine = FoldLine;
            }), ace.define("ace/range_list", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var comparePoints = require("./range").Range.comparePoints, RangeList = function() {
                    this.ranges = [], this.$bias = 1;
                };
                (function() {
                    this.comparePoints = comparePoints, this.pointIndex = function(pos, excludeEdges, startIndex) {
                        for(var list = this.ranges, i = startIndex || 0; i < list.length; i++){
                            var range = list[i], cmpEnd = comparePoints(pos, range.end);
                            if (!(cmpEnd > 0)) {
                                var cmpStart = comparePoints(pos, range.start);
                                if (0 === cmpEnd) return excludeEdges && 0 !== cmpStart ? -i - 2 : i;
                                if (cmpStart > 0 || 0 === cmpStart && !excludeEdges) return i;
                                break;
                            }
                        }
                        return -i - 1;
                    }, this.add = function(range) {
                        var excludeEdges = !range.isEmpty(), startIndex = this.pointIndex(range.start, excludeEdges);
                        startIndex < 0 && (startIndex = -startIndex - 1);
                        var endIndex = this.pointIndex(range.end, excludeEdges, startIndex);
                        return endIndex < 0 ? endIndex = -endIndex - 1 : endIndex++, this.ranges.splice(startIndex, endIndex - startIndex, range);
                    }, this.addList = function(list) {
                        for(var removed = [], i = list.length; i--;)removed.push.apply(removed, this.add(list[i]));
                        return removed;
                    }, this.substractPoint = function(pos) {
                        var i = this.pointIndex(pos);
                        if (i >= 0) return this.ranges.splice(i, 1);
                    }, this.merge = function() {
                        for(var range, removed = [], list = this.ranges, next = (list = list.sort(function(a, b) {
                            return comparePoints(a.start, b.start);
                        }))[0], i = 1; i < list.length; i++){
                            range = next, next = list[i];
                            var cmp = comparePoints(range.end, next.start);
                            !(cmp < 0) && (0 != cmp || range.isEmpty() || next.isEmpty()) && (0 > comparePoints(range.end, next.end) && (range.end.row = next.end.row, range.end.column = next.end.column), list.splice(i, 1), removed.push(next), next = range, i--);
                        }
                        return this.ranges = list, removed;
                    }, this.contains = function(row, column) {
                        return this.pointIndex({
                            row: row,
                            column: column
                        }) >= 0;
                    }, this.containsPoint = function(pos) {
                        return this.pointIndex(pos) >= 0;
                    }, this.rangeAtPoint = function(pos) {
                        var i = this.pointIndex(pos);
                        if (i >= 0) return this.ranges[i];
                    }, this.clipRows = function(startRow, endRow) {
                        var list = this.ranges;
                        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow) return [];
                        var startIndex = this.pointIndex({
                            row: startRow,
                            column: 0
                        });
                        startIndex < 0 && (startIndex = -startIndex - 1);
                        var endIndex = this.pointIndex({
                            row: endRow,
                            column: 0
                        }, startIndex);
                        endIndex < 0 && (endIndex = -endIndex - 1);
                        for(var clipped = [], i = startIndex; i < endIndex; i++)clipped.push(list[i]);
                        return clipped;
                    }, this.removeAll = function() {
                        return this.ranges.splice(0, this.ranges.length);
                    }, this.attach = function(session) {
                        this.session && this.detach(), this.session = session, this.onChange = this.$onChange.bind(this), this.session.on("change", this.onChange);
                    }, this.detach = function() {
                        this.session && (this.session.removeListener("change", this.onChange), this.session = null);
                    }, this.$onChange = function(delta) {
                        for(var start = delta.start, end = delta.end, startRow = start.row, endRow = end.row, ranges = this.ranges, i = 0, n = ranges.length; i < n; i++){
                            var r = ranges[i];
                            if (r.end.row >= startRow) break;
                        }
                        if ("insert" == delta.action) for(var lineDif = endRow - startRow, colDiff = -start.column + end.column; i < n; i++){
                            var r = ranges[i];
                            if (r.start.row > startRow) break;
                            if (r.start.row == startRow && r.start.column >= start.column && (r.start.column == start.column && this.$bias <= 0 || (r.start.column += colDiff, r.start.row += lineDif)), r.end.row == startRow && r.end.column >= start.column) {
                                if (r.end.column == start.column && this.$bias < 0) continue;
                                r.end.column == start.column && colDiff > 0 && i < n - 1 && r.end.column > r.start.column && r.end.column == ranges[i + 1].start.column && (r.end.column -= colDiff), r.end.column += colDiff, r.end.row += lineDif;
                            }
                        }
                        else for(var lineDif = startRow - endRow, colDiff = start.column - end.column; i < n; i++){
                            var r = ranges[i];
                            if (r.start.row > endRow) break;
                            r.end.row < endRow && (startRow < r.end.row || startRow == r.end.row && start.column < r.end.column) ? (r.end.row = startRow, r.end.column = start.column) : r.end.row == endRow ? r.end.column <= end.column ? (lineDif || r.end.column > start.column) && (r.end.column = start.column, r.end.row = start.row) : (r.end.column += colDiff, r.end.row += lineDif) : r.end.row > endRow && (r.end.row += lineDif), r.start.row < endRow && (startRow < r.start.row || startRow == r.start.row && start.column < r.start.column) ? (r.start.row = startRow, r.start.column = start.column) : r.start.row == endRow ? r.start.column <= end.column ? (lineDif || r.start.column > start.column) && (r.start.column = start.column, r.start.row = start.row) : (r.start.column += colDiff, r.start.row += lineDif) : r.start.row > endRow && (r.start.row += lineDif);
                        }
                        if (0 != lineDif && i < n) for(; i < n; i++){
                            var r = ranges[i];
                            r.start.row += lineDif, r.end.row += lineDif;
                        }
                    };
                }).call(RangeList.prototype), exports.RangeList = RangeList;
            }), ace.define("ace/edit_session/fold", [
                "require",
                "exports",
                "module",
                "ace/range_list",
                "ace/lib/oop"
            ], function(require, exports, module) {
                "use strict";
                var RangeList = require("../range_list").RangeList, oop = require("../lib/oop"), Fold = exports.Fold = function(range, placeholder) {
                    this.foldLine = null, this.placeholder = placeholder, this.range = range, this.start = range.start, this.end = range.end, this.sameRow = range.start.row == range.end.row, this.subFolds = this.ranges = [];
                };
                function consumePoint(point, anchor) {
                    point.row -= anchor.row, 0 == point.row && (point.column -= anchor.column);
                }
                function restorePoint(point, anchor) {
                    0 == point.row && (point.column += anchor.column), point.row += anchor.row;
                }
                oop.inherits(Fold, RangeList), (function() {
                    this.toString = function() {
                        return '"' + this.placeholder + '" ' + this.range.toString();
                    }, this.setFoldLine = function(foldLine) {
                        this.foldLine = foldLine, this.subFolds.forEach(function(fold) {
                            fold.setFoldLine(foldLine);
                        });
                    }, this.clone = function() {
                        var fold = new Fold(this.range.clone(), this.placeholder);
                        return this.subFolds.forEach(function(subFold) {
                            fold.subFolds.push(subFold.clone());
                        }), fold.collapseChildren = this.collapseChildren, fold;
                    }, this.addSubFold = function(fold) {
                        if (!this.range.isEqual(fold)) {
                            anchor = this.start, consumePoint(fold.start, anchor), consumePoint(fold.end, anchor);
                            for(var anchor, row = fold.start.row, column = fold.start.column, i = 0, cmp = -1; i < this.subFolds.length && 1 == (cmp = this.subFolds[i].range.compare(row, column)); i++);
                            var afterStart = this.subFolds[i], firstConsumed = 0;
                            if (0 == cmp) {
                                if (afterStart.range.containsRange(fold)) return afterStart.addSubFold(fold);
                                firstConsumed = 1;
                            }
                            for(var row = fold.range.end.row, column = fold.range.end.column, j = i, cmp = -1; j < this.subFolds.length && 1 == (cmp = this.subFolds[j].range.compare(row, column)); j++);
                            0 == cmp && j++;
                            for(var consumedFolds = this.subFolds.splice(i, j - i, fold), last = 0 == cmp ? consumedFolds.length - 1 : consumedFolds.length, k = firstConsumed; k < last; k++)fold.addSubFold(consumedFolds[k]);
                            return fold.setFoldLine(this.foldLine), fold;
                        }
                    }, this.restoreRange = function(range) {
                        var anchor;
                        return anchor = this.start, void (restorePoint(range.start, anchor), restorePoint(range.end, anchor));
                    };
                }).call(Fold.prototype);
            }), ace.define("ace/edit_session/folding", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/edit_session/fold_line",
                "ace/edit_session/fold",
                "ace/token_iterator"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("../range").Range, FoldLine = require("./fold_line").FoldLine, Fold = require("./fold").Fold, TokenIterator = require("../token_iterator").TokenIterator;
                exports.Folding = function() {
                    this.getFoldAt = function(row, column, side) {
                        var foldLine = this.getFoldLine(row);
                        if (!foldLine) return null;
                        for(var folds = foldLine.folds, i = 0; i < folds.length; i++){
                            var range = folds[i].range;
                            if (range.contains(row, column)) {
                                if (1 == side && range.isEnd(row, column) && !range.isEmpty() || -1 == side && range.isStart(row, column) && !range.isEmpty()) continue;
                                return folds[i];
                            }
                        }
                    }, this.getFoldsInRange = function(range) {
                        var start = range.start, end = range.end, foldLines = this.$foldData, foundFolds = [];
                        start.column += 1, end.column -= 1;
                        for(var i = 0; i < foldLines.length; i++){
                            var cmp = foldLines[i].range.compareRange(range);
                            if (2 != cmp) {
                                if (-2 == cmp) break;
                                for(var folds = foldLines[i].folds, j = 0; j < folds.length; j++){
                                    var fold = folds[j];
                                    if (-2 == (cmp = fold.range.compareRange(range))) break;
                                    if (2 != cmp) {
                                        if (42 == cmp) break;
                                        foundFolds.push(fold);
                                    }
                                }
                            }
                        }
                        return start.column -= 1, end.column += 1, foundFolds;
                    }, this.getFoldsInRangeList = function(ranges) {
                        if (Array.isArray(ranges)) {
                            var folds = [];
                            ranges.forEach(function(range) {
                                folds = folds.concat(this.getFoldsInRange(range));
                            }, this);
                        } else var folds = this.getFoldsInRange(ranges);
                        return folds;
                    }, this.getAllFolds = function() {
                        for(var folds = [], foldLines = this.$foldData, i = 0; i < foldLines.length; i++)for(var j = 0; j < foldLines[i].folds.length; j++)folds.push(foldLines[i].folds[j]);
                        return folds;
                    }, this.getFoldStringAt = function(row, column, trim, foldLine) {
                        if (!(foldLine = foldLine || this.getFoldLine(row))) return null;
                        for(var str, fold, lastFold = {
                            end: {
                                column: 0
                            }
                        }, i = 0; i < foldLine.folds.length; i++){
                            var cmp = (fold = foldLine.folds[i]).range.compareEnd(row, column);
                            if (-1 == cmp) {
                                str = this.getLine(fold.start.row).substring(lastFold.end.column, fold.start.column);
                                break;
                            }
                            if (0 === cmp) return null;
                            lastFold = fold;
                        }
                        return (str || (str = this.getLine(fold.start.row).substring(lastFold.end.column)), -1 == trim) ? str.substring(0, column - lastFold.end.column) : 1 == trim ? str.substring(column - lastFold.end.column) : str;
                    }, this.getFoldLine = function(docRow, startFoldLine) {
                        var foldData = this.$foldData, i = 0;
                        for(startFoldLine && (i = foldData.indexOf(startFoldLine)), -1 == i && (i = 0); i < foldData.length; i++){
                            var foldLine = foldData[i];
                            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) return foldLine;
                            if (foldLine.end.row > docRow) break;
                        }
                        return null;
                    }, this.getNextFoldLine = function(docRow, startFoldLine) {
                        var foldData = this.$foldData, i = 0;
                        for(startFoldLine && (i = foldData.indexOf(startFoldLine)), -1 == i && (i = 0); i < foldData.length; i++){
                            var foldLine = foldData[i];
                            if (foldLine.end.row >= docRow) return foldLine;
                        }
                        return null;
                    }, this.getFoldedRowCount = function(first, last) {
                        for(var foldData = this.$foldData, rowCount = last - first + 1, i = 0; i < foldData.length; i++){
                            var foldLine = foldData[i], end = foldLine.end.row, start = foldLine.start.row;
                            if (end >= last) {
                                start < last && (start >= first ? rowCount -= last - start : rowCount = 0);
                                break;
                            }
                            end >= first && (start >= first ? // fold inside range
                            rowCount -= end - start : rowCount -= end - first + 1);
                        }
                        return rowCount;
                    }, this.$addFoldLine = function(foldLine) {
                        return this.$foldData.push(foldLine), this.$foldData.sort(function(a, b) {
                            return a.start.row - b.start.row;
                        }), foldLine;
                    }, this.addFold = function(placeholder, range) {
                        var fold, foldData = this.$foldData, added = !1;
                        placeholder instanceof Fold ? fold = placeholder : (fold = new Fold(range, placeholder)).collapseChildren = range.collapseChildren, this.$clipRangeToDocument(fold.range);
                        var startRow = fold.start.row, startColumn = fold.start.column, endRow = fold.end.row, endColumn = fold.end.column, startFold = this.getFoldAt(startRow, startColumn, 1), endFold = this.getFoldAt(endRow, endColumn, -1);
                        if (startFold && endFold == startFold) return startFold.addSubFold(fold);
                        startFold && !startFold.range.isStart(startRow, startColumn) && this.removeFold(startFold), endFold && !endFold.range.isEnd(endRow, endColumn) && this.removeFold(endFold);
                        var folds = this.getFoldsInRange(fold.range);
                        folds.length > 0 && (this.removeFolds(folds), fold.collapseChildren || folds.forEach(function(subFold) {
                            fold.addSubFold(subFold);
                        }));
                        for(var i = 0; i < foldData.length; i++){
                            var foldLine = foldData[i];
                            if (endRow == foldLine.start.row) {
                                foldLine.addFold(fold), added = !0;
                                break;
                            }
                            if (startRow == foldLine.end.row) {
                                if (foldLine.addFold(fold), added = !0, !fold.sameRow) {
                                    var foldLineNext = foldData[i + 1];
                                    foldLineNext && foldLineNext.start.row == endRow && foldLine.merge(foldLineNext);
                                }
                                break;
                            }
                            if (endRow <= foldLine.start.row) break;
                        }
                        return added || (foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold))), this.$useWrapMode ? this.$updateWrapData(foldLine.start.row, foldLine.start.row) : this.$updateRowLengthCache(foldLine.start.row, foldLine.start.row), this.$modified = !0, this._signal("changeFold", {
                            data: fold,
                            action: "add"
                        }), fold;
                    }, this.addFolds = function(folds) {
                        folds.forEach(function(fold) {
                            this.addFold(fold);
                        }, this);
                    }, this.removeFold = function(fold) {
                        var foldLine = fold.foldLine, startRow = foldLine.start.row, endRow = foldLine.end.row, foldLines = this.$foldData, folds = foldLine.folds;
                        if (1 == folds.length) foldLines.splice(foldLines.indexOf(foldLine), 1);
                        else if (foldLine.range.isEnd(fold.end.row, fold.end.column)) folds.pop(), foldLine.end.row = folds[folds.length - 1].end.row, foldLine.end.column = folds[folds.length - 1].end.column;
                        else if (foldLine.range.isStart(fold.start.row, fold.start.column)) folds.shift(), foldLine.start.row = folds[0].start.row, foldLine.start.column = folds[0].start.column;
                        else if (fold.sameRow) folds.splice(folds.indexOf(fold), 1);
                        else {
                            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
                            (folds = newFoldLine.folds).shift(), newFoldLine.start.row = folds[0].start.row, newFoldLine.start.column = folds[0].start.column;
                        }
                        this.$updating || (this.$useWrapMode ? this.$updateWrapData(startRow, endRow) : this.$updateRowLengthCache(startRow, endRow)), this.$modified = !0, this._signal("changeFold", {
                            data: fold,
                            action: "remove"
                        });
                    }, this.removeFolds = function(folds) {
                        for(var cloneFolds = [], i = 0; i < folds.length; i++)cloneFolds.push(folds[i]);
                        cloneFolds.forEach(function(fold) {
                            this.removeFold(fold);
                        }, this), this.$modified = !0;
                    }, this.expandFold = function(fold) {
                        this.removeFold(fold), fold.subFolds.forEach(function(subFold) {
                            fold.restoreRange(subFold), this.addFold(subFold);
                        }, this), fold.collapseChildren > 0 && this.foldAll(fold.start.row + 1, fold.end.row, fold.collapseChildren - 1), fold.subFolds = [];
                    }, this.expandFolds = function(folds) {
                        folds.forEach(function(fold) {
                            this.expandFold(fold);
                        }, this);
                    }, this.unfold = function(location, expandInner) {
                        if (null == location) range = new Range(0, 0, this.getLength(), 0), null == expandInner && (expandInner = !0);
                        else if ("number" == typeof location) range = new Range(location, 0, location, this.getLine(location).length);
                        else if ("row" in location) range = Range.fromPoints(location, location);
                        else {
                            if (Array.isArray(location)) return folds = [], location.forEach(function(range) {
                                folds = folds.concat(this.unfold(range));
                            }, this), folds;
                            range = location;
                        }
                        for(var range, folds, outermostFolds = folds = this.getFoldsInRangeList(range); 1 == folds.length && 0 > Range.comparePoints(folds[0].start, range.start) && Range.comparePoints(folds[0].end, range.end) > 0;)this.expandFolds(folds), folds = this.getFoldsInRangeList(range);
                        if (!1 != expandInner ? this.removeFolds(folds) : this.expandFolds(folds), outermostFolds.length) return outermostFolds;
                    }, this.isRowFolded = function(docRow, startFoldRow) {
                        return !!this.getFoldLine(docRow, startFoldRow);
                    }, this.getRowFoldEnd = function(docRow, startFoldRow) {
                        var foldLine = this.getFoldLine(docRow, startFoldRow);
                        return foldLine ? foldLine.end.row : docRow;
                    }, this.getRowFoldStart = function(docRow, startFoldRow) {
                        var foldLine = this.getFoldLine(docRow, startFoldRow);
                        return foldLine ? foldLine.start.row : docRow;
                    }, this.getFoldDisplayLine = function(foldLine, endRow, endColumn, startRow, startColumn) {
                        null == startRow && (startRow = foldLine.start.row), null == startColumn && (startColumn = 0), null == endRow && (endRow = foldLine.end.row), null == endColumn && (endColumn = this.getLine(endRow).length);
                        var doc = this.doc, textLine = "";
                        return foldLine.walk(function(placeholder, row, column, lastColumn) {
                            if (!(row < startRow)) {
                                if (row == startRow) {
                                    if (column < startColumn) return;
                                    lastColumn = Math.max(startColumn, lastColumn);
                                }
                                null != placeholder ? textLine += placeholder : textLine += doc.getLine(row).substring(lastColumn, column);
                            }
                        }, endRow, endColumn), textLine;
                    }, this.getDisplayLine = function(row, endColumn, startRow, startColumn) {
                        var line, foldLine = this.getFoldLine(row);
                        return foldLine ? this.getFoldDisplayLine(foldLine, row, endColumn, startRow, startColumn) : (line = this.doc.getLine(row)).substring(startColumn || 0, endColumn || line.length);
                    }, this.$cloneFoldData = function() {
                        var fd = [];
                        return fd = this.$foldData.map(function(foldLine) {
                            var folds = foldLine.folds.map(function(fold) {
                                return fold.clone();
                            });
                            return new FoldLine(fd, folds);
                        });
                    }, this.toggleFold = function(tryToUnfold) {
                        var fold, bracketPos, range = this.selection.getRange();
                        if (range.isEmpty()) {
                            var cursor = range.start;
                            if (fold = this.getFoldAt(cursor.row, cursor.column)) {
                                this.expandFold(fold);
                                return;
                            }
                            (bracketPos = this.findMatchingBracket(cursor)) ? 1 == range.comparePoint(bracketPos) ? range.end = bracketPos : (range.start = bracketPos, range.start.column++, range.end.column--) : (bracketPos = this.findMatchingBracket({
                                row: cursor.row,
                                column: cursor.column + 1
                            })) ? (1 == range.comparePoint(bracketPos) ? range.end = bracketPos : range.start = bracketPos, range.start.column++) : range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
                        } else {
                            var folds = this.getFoldsInRange(range);
                            if (tryToUnfold && folds.length) {
                                this.expandFolds(folds);
                                return;
                            }
                            1 == folds.length && (fold = folds[0]);
                        }
                        if (fold || (fold = this.getFoldAt(range.start.row, range.start.column)), fold && fold.range.toString() == range.toString()) {
                            this.expandFold(fold);
                            return;
                        }
                        var placeholder = "...";
                        if (!range.isMultiLine()) {
                            if ((placeholder = this.getTextRange(range)).length < 4) return;
                            placeholder = placeholder.trim().substring(0, 2) + "..";
                        }
                        this.addFold(placeholder, range);
                    }, this.getCommentFoldRange = function(row, column, dir) {
                        var iterator = new TokenIterator(this, row, column), token = iterator.getCurrentToken(), type = token && token.type;
                        if (token && /^comment|string/.test(type)) {
                            "comment" == (type = type.match(/comment|string/)[0]) && (type += "|doc-start");
                            var re = new RegExp(type), range = new Range();
                            if (1 != dir) {
                                do token = iterator.stepBackward();
                                while (token && re.test(token.type))
                                iterator.stepForward();
                            }
                            if (range.start.row = iterator.getCurrentTokenRow(), range.start.column = iterator.getCurrentTokenColumn() + 2, iterator = new TokenIterator(this, row, column), -1 != dir) {
                                var lastRow = -1;
                                do if (token = iterator.stepForward(), -1 == lastRow) {
                                    var state = this.getState(iterator.$row);
                                    re.test(state) || (lastRow = iterator.$row);
                                } else if (iterator.$row > lastRow) break;
                                while (token && re.test(token.type))
                                token = iterator.stepBackward();
                            } else token = iterator.getCurrentToken();
                            return range.end.row = iterator.getCurrentTokenRow(), range.end.column = iterator.getCurrentTokenColumn() + token.value.length - 2, range;
                        }
                    }, this.foldAll = function(startRow, endRow, depth, test) {
                        void 0 == depth && (depth = 100000); // JSON.stringify doesn't hanle Infinity
                        var foldWidgets = this.foldWidgets;
                        if (foldWidgets) {
                            endRow = endRow || this.getLength(), startRow = startRow || 0;
                            for(var row = startRow; row < endRow; row++)if (null == foldWidgets[row] && (foldWidgets[row] = this.getFoldWidget(row)), "start" == foldWidgets[row] && (!test || test(row))) {
                                var range = this.getFoldWidgetRange(row);
                                range && range.isMultiLine() && range.end.row <= endRow && range.start.row >= startRow && (row = range.end.row, range.collapseChildren = depth, this.addFold("...", range));
                            }
                        } // mode doesn't support folding
                    }, this.foldToLevel = function(level) {
                        for(this.foldAll(); level-- > 0;)this.unfold(null, !1);
                    }, this.foldAllComments = function() {
                        var session = this;
                        this.foldAll(null, null, null, function(row) {
                            for(var tokens = session.getTokens(row), i = 0; i < tokens.length; i++){
                                var token = tokens[i];
                                if (!("text" == token.type && /^\s+$/.test(token.value))) {
                                    if (/comment/.test(token.type)) return !0;
                                    return !1;
                                }
                            }
                        });
                    }, this.$foldStyles = {
                        manual: 1,
                        markbegin: 1,
                        markbeginend: 1
                    }, this.$foldStyle = "markbegin", this.setFoldStyle = function(style) {
                        if (!this.$foldStyles[style]) throw Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
                        if (this.$foldStyle != style) {
                            this.$foldStyle = style, "manual" == style && this.unfold();
                            var mode = this.$foldMode;
                            this.$setFolding(null), this.$setFolding(mode);
                        }
                    }, this.$setFolding = function(foldMode) {
                        if (this.$foldMode != foldMode) {
                            if (this.$foldMode = foldMode, this.off("change", this.$updateFoldWidgets), this.off("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets), this._signal("changeAnnotation"), !foldMode || "manual" == this.$foldStyle) {
                                this.foldWidgets = null;
                                return;
                            }
                            this.foldWidgets = [], this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle), this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle), this.$updateFoldWidgets = this.updateFoldWidgets.bind(this), this.$tokenizerUpdateFoldWidgets = this.tokenizerUpdateFoldWidgets.bind(this), this.on("change", this.$updateFoldWidgets), this.on("tokenizerUpdate", this.$tokenizerUpdateFoldWidgets);
                        }
                    }, this.getParentFoldRangeData = function(row, ignoreCurrent) {
                        var fw = this.foldWidgets;
                        if (!fw || ignoreCurrent && fw[row]) return {};
                        for(var firstRange, i = row - 1; i >= 0;){
                            var c = fw[i];
                            if (null == c && (c = fw[i] = this.getFoldWidget(i)), "start" == c) {
                                var range = this.getFoldWidgetRange(i);
                                if (firstRange || (firstRange = range), range && range.end.row >= row) break;
                            }
                            i--;
                        }
                        return {
                            range: -1 !== i && range,
                            firstRange: firstRange
                        };
                    }, this.onFoldWidgetClick = function(row, e) {
                        var options = {
                            children: (e = e.domEvent).shiftKey,
                            all: e.ctrlKey || e.metaKey,
                            siblings: e.altKey
                        };
                        if (!this.$toggleFoldWidget(row, options)) {
                            var el = e.target || e.srcElement;
                            el && /ace_fold-widget/.test(el.className) && (el.className += " ace_invalid");
                        }
                    }, this.$toggleFoldWidget = function(row, options) {
                        if (this.getFoldWidget) {
                            var type = this.getFoldWidget(row), line = this.getLine(row), dir = "end" === type ? -1 : 1, fold = this.getFoldAt(row, -1 === dir ? 0 : line.length, dir);
                            if (fold) return options.children || options.all ? this.removeFold(fold) : this.expandFold(fold), fold;
                            var range = this.getFoldWidgetRange(row, !0);
                            if (range && !range.isMultiLine() && (fold = this.getFoldAt(range.start.row, range.start.column, 1)) && range.isEqual(fold.range)) return this.removeFold(fold), fold;
                            if (options.siblings) {
                                var data = this.getParentFoldRangeData(row);
                                if (data.range) var startRow = data.range.start.row + 1, endRow = data.range.end.row;
                                this.foldAll(startRow, endRow, options.all ? 10000 : 0);
                            } else options.children ? (endRow = range ? range.end.row : this.getLength(), this.foldAll(row + 1, endRow, options.all ? 10000 : 0)) : range && (options.all && (range.collapseChildren = 10000), this.addFold("...", range));
                            return range;
                        }
                    }, this.toggleFoldWidget = function(toggleParent) {
                        var row = this.selection.getCursor().row;
                        row = this.getRowFoldStart(row);
                        var range = this.$toggleFoldWidget(row, {});
                        if (!range) {
                            var data = this.getParentFoldRangeData(row, !0);
                            if (range = data.range || data.firstRange) {
                                row = range.start.row;
                                var fold = this.getFoldAt(row, this.getLine(row).length, 1);
                                fold ? this.removeFold(fold) : this.addFold("...", range);
                            }
                        }
                    }, this.updateFoldWidgets = function(delta) {
                        var firstRow = delta.start.row, len = delta.end.row - firstRow;
                        if (0 === len) this.foldWidgets[firstRow] = null;
                        else if ("remove" == delta.action) this.foldWidgets.splice(firstRow, len + 1, null);
                        else {
                            var args = Array(len + 1);
                            args.unshift(firstRow, 1), this.foldWidgets.splice.apply(this.foldWidgets, args);
                        }
                    }, this.tokenizerUpdateFoldWidgets = function(e) {
                        var rows = e.data;
                        rows.first != rows.last && this.foldWidgets.length > rows.first && this.foldWidgets.splice(rows.first, this.foldWidgets.length);
                    };
                };
            }), ace.define("ace/edit_session/bracket_match", [
                "require",
                "exports",
                "module",
                "ace/token_iterator",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var TokenIterator = require("../token_iterator").TokenIterator, Range = require("../range").Range;
                exports.BracketMatch = function() {
                    this.findMatchingBracket = function(position, chr) {
                        if (0 == position.column) return null;
                        var charBeforeCursor = chr || this.getLine(position.row).charAt(position.column - 1);
                        if ("" == charBeforeCursor) return null;
                        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
                        return match ? match[1] ? this.$findClosingBracket(match[1], position) : this.$findOpeningBracket(match[2], position) : null;
                    }, this.getBracketRange = function(pos) {
                        var range, line = this.getLine(pos.row), before = !0, chr = line.charAt(pos.column - 1), match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
                        if (match || (chr = line.charAt(pos.column), pos = {
                            row: pos.row,
                            column: pos.column + 1
                        }, match = chr && chr.match(/([\(\[\{])|([\)\]\}])/), before = !1), !match) return null;
                        if (match[1]) {
                            var bracketPos = this.$findClosingBracket(match[1], pos);
                            if (!bracketPos) return null;
                            range = Range.fromPoints(pos, bracketPos), !before && (range.end.column++, range.start.column--), range.cursor = range.end;
                        } else {
                            var bracketPos = this.$findOpeningBracket(match[2], pos);
                            if (!bracketPos) return null;
                            range = Range.fromPoints(bracketPos, pos), !before && (range.start.column++, range.end.column--), range.cursor = range.start;
                        }
                        return range;
                    }, this.getMatchingBracketRanges = function(pos) {
                        var line = this.getLine(pos.row), chr = line.charAt(pos.column - 1), match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
                        if (match || (chr = line.charAt(pos.column), pos = {
                            row: pos.row,
                            column: pos.column + 1
                        }, match = chr && chr.match(/([\(\[\{])|([\)\]\}])/)), !match) return null;
                        var startRange = new Range(pos.row, pos.column - 1, pos.row, pos.column), bracketPos = match[1] ? this.$findClosingBracket(match[1], pos) : this.$findOpeningBracket(match[2], pos);
                        return bracketPos ? [
                            startRange,
                            new Range(bracketPos.row, bracketPos.column, bracketPos.row, bracketPos.column + 1)
                        ] : [
                            startRange
                        ];
                    }, this.$brackets = {
                        ")": "(",
                        "(": ")",
                        "]": "[",
                        "[": "]",
                        "{": "}",
                        "}": "{",
                        "<": ">",
                        ">": "<"
                    }, this.$findOpeningBracket = function(bracket, position, typeRe) {
                        var openBracket = this.$brackets[bracket], depth = 1, iterator = new TokenIterator(this, position.row, position.column), token = iterator.getCurrentToken();
                        if (token || (token = iterator.stepForward()), token) {
                            typeRe || (typeRe = RegExp("(\\.?" + token.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end)\b/, "(?:start|begin|end)") + ")+"));
                            for(var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2, value = token.value;;){
                                for(; valueIndex >= 0;){
                                    var chr = value.charAt(valueIndex);
                                    if (chr == openBracket) {
                                        if (0 == (depth -= 1)) return {
                                            row: iterator.getCurrentTokenRow(),
                                            column: valueIndex + iterator.getCurrentTokenColumn()
                                        };
                                    } else chr == bracket && (depth += 1);
                                    valueIndex -= 1;
                                }
                                do token = iterator.stepBackward();
                                while (token && !typeRe.test(token.type))
                                if (null == token) break;
                                valueIndex = (value = token.value).length - 1;
                            }
                            return null;
                        }
                    }, this.$findClosingBracket = function(bracket, position, typeRe) {
                        var closingBracket = this.$brackets[bracket], depth = 1, iterator = new TokenIterator(this, position.row, position.column), token = iterator.getCurrentToken();
                        if (token || (token = iterator.stepForward()), token) {
                            typeRe || (typeRe = RegExp("(\\.?" + token.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:start|begin)\b/, "(?:start|begin|end)") + ")+"));
                            for(var valueIndex = position.column - iterator.getCurrentTokenColumn();;){
                                for(var value = token.value, valueLength = value.length; valueIndex < valueLength;){
                                    var chr = value.charAt(valueIndex);
                                    if (chr == closingBracket) {
                                        if (0 == (depth -= 1)) return {
                                            row: iterator.getCurrentTokenRow(),
                                            column: valueIndex + iterator.getCurrentTokenColumn()
                                        };
                                    } else chr == bracket && (depth += 1);
                                    valueIndex += 1;
                                }
                                do token = iterator.stepForward();
                                while (token && !typeRe.test(token.type))
                                if (null == token) break;
                                valueIndex = 0;
                            }
                            return null;
                        }
                    };
                };
            }), ace.define("ace/edit_session", [
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
                "ace/edit_session/bracket_match"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), lang = require("./lib/lang"), BidiHandler = require("./bidihandler").BidiHandler, config = require("./config"), EventEmitter = require("./lib/event_emitter").EventEmitter, Selection = require("./selection").Selection, TextMode = require("./mode/text").Mode, Range = require("./range").Range, Document = require("./document").Document, BackgroundTokenizer = require("./background_tokenizer").BackgroundTokenizer, SearchHighlight = require("./search_highlight").SearchHighlight, EditSession = function(text, mode) {
                    this.$breakpoints = [], this.$decorations = [], this.$frontMarkers = {}, this.$backMarkers = {}, this.$markerId = 1, this.$undoSelect = !0, this.$foldData = [], this.id = "session" + ++EditSession.$uid, this.$foldData.toString = function() {
                        return this.join("\n");
                    }, this.on("changeFold", this.onChangeFold.bind(this)), this.$onChange = this.onChange.bind(this), "object" == typeof text && text.getLine || (text = new Document(text)), this.setDocument(text), this.selection = new Selection(this), this.$bidiHandler = new BidiHandler(this), config.resetOptions(this), this.setMode(mode), config._signal("session", this);
                };
                EditSession.$uid = 0, (function() {
                    oop.implement(this, EventEmitter), this.setDocument = function(doc) {
                        this.doc && this.doc.off("change", this.$onChange), this.doc = doc, doc.on("change", this.$onChange), this.bgTokenizer && this.bgTokenizer.setDocument(this.getDocument()), this.resetCaches();
                    }, this.getDocument = function() {
                        return this.doc;
                    }, this.$resetRowCache = function(docRow) {
                        if (!docRow) {
                            this.$docRowCache = [], this.$screenRowCache = [];
                            return;
                        }
                        var l = this.$docRowCache.length, i = this.$getRowCacheIndex(this.$docRowCache, docRow) + 1;
                        l > i && (this.$docRowCache.splice(i, l), this.$screenRowCache.splice(i, l));
                    }, this.$getRowCacheIndex = function(cacheArray, val) {
                        for(var low = 0, hi = cacheArray.length - 1; low <= hi;){
                            var mid = low + hi >> 1, c = cacheArray[mid];
                            if (val > c) low = mid + 1;
                            else {
                                if (!(val < c)) return mid;
                                hi = mid - 1;
                            }
                        }
                        return low - 1;
                    }, this.resetCaches = function() {
                        this.$modified = !0, this.$wrapData = [], this.$rowLengthCache = [], this.$resetRowCache(0), this.bgTokenizer && this.bgTokenizer.start(0);
                    }, this.onChangeFold = function(e) {
                        var fold = e.data;
                        this.$resetRowCache(fold.start.row);
                    }, this.onChange = function(delta) {
                        this.$modified = !0, this.$bidiHandler.onChange(delta), this.$resetRowCache(delta.start.row);
                        var removedFolds = this.$updateInternalDataOnChange(delta);
                        !this.$fromUndo && this.$undoManager && (removedFolds && removedFolds.length && (this.$undoManager.add({
                            action: "removeFolds",
                            folds: removedFolds
                        }, this.mergeUndoDeltas), this.mergeUndoDeltas = !0), this.$undoManager.add(delta, this.mergeUndoDeltas), this.mergeUndoDeltas = !0, this.$informUndoManager.schedule()), this.bgTokenizer && this.bgTokenizer.$updateOnChange(delta), this._signal("change", delta);
                    }, this.setValue = function(text) {
                        this.doc.setValue(text), this.selection.moveTo(0, 0), this.$resetRowCache(0), this.setUndoManager(this.$undoManager), this.getUndoManager().reset();
                    }, this.getValue = this.toString = function() {
                        return this.doc.getValue();
                    }, this.getSelection = function() {
                        return this.selection;
                    }, this.getState = function(row) {
                        return this.bgTokenizer.getState(row);
                    }, this.getTokens = function(row) {
                        return this.bgTokenizer.getTokens(row);
                    }, this.getTokenAt = function(row, column) {
                        var token, tokens = this.bgTokenizer.getTokens(row), c = 0;
                        if (null == column) {
                            var i = tokens.length - 1;
                            c = this.getLine(row).length;
                        } else for(var i = 0; i < tokens.length && !((c += tokens[i].value.length) >= column); i++);
                        return (token = tokens[i]) ? (token.index = i, token.start = c - token.value.length, token) : null;
                    }, this.setUndoManager = function(undoManager) {
                        if (this.$undoManager = undoManager, this.$informUndoManager && this.$informUndoManager.cancel(), undoManager) {
                            var self1 = this;
                            undoManager.addSession(this), this.$syncInformUndoManager = function() {
                                self1.$informUndoManager.cancel(), self1.mergeUndoDeltas = !1;
                            }, this.$informUndoManager = lang.delayedCall(this.$syncInformUndoManager);
                        } else this.$syncInformUndoManager = function() {};
                    }, this.markUndoGroup = function() {
                        this.$syncInformUndoManager && this.$syncInformUndoManager();
                    }, this.$defaultUndoManager = {
                        undo: function() {},
                        redo: function() {},
                        hasUndo: function() {},
                        hasRedo: function() {},
                        reset: function() {},
                        add: function() {},
                        addSelection: function() {},
                        startNewGroup: function() {},
                        addSession: function() {}
                    }, this.getUndoManager = function() {
                        return this.$undoManager || this.$defaultUndoManager;
                    }, this.getTabString = function() {
                        return this.getUseSoftTabs() ? lang.stringRepeat(" ", this.getTabSize()) : "\t";
                    }, this.setUseSoftTabs = function(val) {
                        this.setOption("useSoftTabs", val);
                    }, this.getUseSoftTabs = function() {
                        return this.$useSoftTabs && !this.$mode.$indentWithTabs;
                    }, this.setTabSize = function(tabSize) {
                        this.setOption("tabSize", tabSize);
                    }, this.getTabSize = function() {
                        return this.$tabSize;
                    }, this.isTabStop = function(position) {
                        return this.$useSoftTabs && position.column % this.$tabSize == 0;
                    }, this.setNavigateWithinSoftTabs = function(navigateWithinSoftTabs) {
                        this.setOption("navigateWithinSoftTabs", navigateWithinSoftTabs);
                    }, this.getNavigateWithinSoftTabs = function() {
                        return this.$navigateWithinSoftTabs;
                    }, this.$overwrite = !1, this.setOverwrite = function(overwrite) {
                        this.setOption("overwrite", overwrite);
                    }, this.getOverwrite = function() {
                        return this.$overwrite;
                    }, this.toggleOverwrite = function() {
                        this.setOverwrite(!this.$overwrite);
                    }, this.addGutterDecoration = function(row, className) {
                        this.$decorations[row] || (this.$decorations[row] = ""), this.$decorations[row] += " " + className, this._signal("changeBreakpoint", {});
                    }, this.removeGutterDecoration = function(row, className) {
                        this.$decorations[row] = (this.$decorations[row] || "").replace(" " + className, ""), this._signal("changeBreakpoint", {});
                    }, this.getBreakpoints = function() {
                        return this.$breakpoints;
                    }, this.setBreakpoints = function(rows) {
                        this.$breakpoints = [];
                        for(var i = 0; i < rows.length; i++)this.$breakpoints[rows[i]] = "ace_breakpoint";
                        this._signal("changeBreakpoint", {});
                    }, this.clearBreakpoints = function() {
                        this.$breakpoints = [], this._signal("changeBreakpoint", {});
                    }, this.setBreakpoint = function(row, className) {
                        void 0 === className && (className = "ace_breakpoint"), className ? this.$breakpoints[row] = className : delete this.$breakpoints[row], this._signal("changeBreakpoint", {});
                    }, this.clearBreakpoint = function(row) {
                        delete this.$breakpoints[row], this._signal("changeBreakpoint", {});
                    }, this.addMarker = function(range, clazz, type, inFront) {
                        var id = this.$markerId++, marker = {
                            range: range,
                            type: type || "line",
                            renderer: "function" == typeof type ? type : null,
                            clazz: clazz,
                            inFront: !!inFront,
                            id: id
                        };
                        return inFront ? (this.$frontMarkers[id] = marker, this._signal("changeFrontMarker")) : (this.$backMarkers[id] = marker, this._signal("changeBackMarker")), id;
                    }, this.addDynamicMarker = function(marker, inFront) {
                        if (marker.update) {
                            var id = this.$markerId++;
                            return marker.id = id, marker.inFront = !!inFront, inFront ? (this.$frontMarkers[id] = marker, this._signal("changeFrontMarker")) : (this.$backMarkers[id] = marker, this._signal("changeBackMarker")), marker;
                        }
                    }, this.removeMarker = function(markerId) {
                        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
                        if (marker) {
                            var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
                            delete markers[markerId], this._signal(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
                        }
                    }, this.getMarkers = function(inFront) {
                        return inFront ? this.$frontMarkers : this.$backMarkers;
                    }, this.highlight = function(re) {
                        if (!this.$searchHighlight) {
                            var highlight = new SearchHighlight(null, "ace_selected-word", "text");
                            this.$searchHighlight = this.addDynamicMarker(highlight);
                        }
                        this.$searchHighlight.setRegexp(re);
                    }, this.highlightLines = function(startRow, endRow, clazz, inFront) {
                        "number" != typeof endRow && (clazz = endRow, endRow = startRow), clazz || (clazz = "ace_step");
                        var range = new Range(startRow, 0, endRow, 1 / 0);
                        return range.id = this.addMarker(range, clazz, "fullLine", inFront), range;
                    }, this.setAnnotations = function(annotations) {
                        this.$annotations = annotations, this._signal("changeAnnotation", {});
                    }, this.getAnnotations = function() {
                        return this.$annotations || [];
                    }, this.clearAnnotations = function() {
                        this.setAnnotations([]);
                    }, this.$detectNewLine = function(text) {
                        var match = text.match(/^.*?(\r?\n)/m);
                        match ? this.$autoNewLine = match[1] : this.$autoNewLine = "\n";
                    }, this.getWordRange = function(row, column) {
                        var line = this.getLine(row), inToken = !1;
                        if (column > 0 && (inToken = !!line.charAt(column - 1).match(this.tokenRe)), inToken || (inToken = !!line.charAt(column).match(this.tokenRe)), inToken) var re = this.tokenRe;
                        else if (/^\s+$/.test(line.slice(column - 1, column + 1))) var re = /\s/;
                        else var re = this.nonTokenRe;
                        var start = column;
                        if (start > 0) {
                            do start--;
                            while (start >= 0 && line.charAt(start).match(re))
                            start++;
                        }
                        for(var end = column; end < line.length && line.charAt(end).match(re);)end++;
                        return new Range(row, start, row, end);
                    }, this.getAWordRange = function(row, column) {
                        for(var wordRange = this.getWordRange(row, column), line = this.getLine(wordRange.end.row); line.charAt(wordRange.end.column).match(/[ \t]/);)wordRange.end.column += 1;
                        return wordRange;
                    }, this.setNewLineMode = function(newLineMode) {
                        this.doc.setNewLineMode(newLineMode);
                    }, this.getNewLineMode = function() {
                        return this.doc.getNewLineMode();
                    }, this.setUseWorker = function(useWorker) {
                        this.setOption("useWorker", useWorker);
                    }, this.getUseWorker = function() {
                        return this.$useWorker;
                    }, this.onReloadTokenizer = function(e) {
                        var rows = e.data;
                        this.bgTokenizer.start(rows.first), this._signal("tokenizerUpdate", e);
                    }, this.$modes = config.$modes, this.$mode = null, this.$modeId = null, this.setMode = function(mode, cb) {
                        if (mode && "object" == typeof mode) {
                            if (mode.getTokenizer) return this.$onChangeMode(mode);
                            var options = mode, path = options.path;
                        } else path = mode || "ace/mode/text";
                        if (this.$modes["ace/mode/text"] || (this.$modes["ace/mode/text"] = new TextMode()), this.$modes[path] && !options) {
                            this.$onChangeMode(this.$modes[path]), cb && cb();
                            return;
                        }
                        this.$modeId = path, config.loadModule([
                            "mode",
                            path
                        ], (function(m) {
                            if (this.$modeId !== path) return cb && cb();
                            this.$modes[path] && !options ? this.$onChangeMode(this.$modes[path]) : m && m.Mode && (m = new m.Mode(options), options || (this.$modes[path] = m, m.$id = path), this.$onChangeMode(m)), cb && cb();
                        }).bind(this)), this.$mode || this.$onChangeMode(this.$modes["ace/mode/text"], !0);
                    }, this.$onChangeMode = function(mode, $isPlaceholder) {
                        if ($isPlaceholder || (this.$modeId = mode.$id), this.$mode !== mode) {
                            var oldMode = this.$mode;
                            this.$mode = mode, this.$stopWorker(), this.$useWorker && this.$startWorker();
                            var tokenizer = mode.getTokenizer();
                            if (void 0 !== tokenizer.on) {
                                var onReloadTokenizer = this.onReloadTokenizer.bind(this);
                                tokenizer.on("update", onReloadTokenizer);
                            }
                            if (this.bgTokenizer) this.bgTokenizer.setTokenizer(tokenizer);
                            else {
                                this.bgTokenizer = new BackgroundTokenizer(tokenizer);
                                var _self = this;
                                this.bgTokenizer.on("update", function(e) {
                                    _self._signal("tokenizerUpdate", e);
                                });
                            }
                            this.bgTokenizer.setDocument(this.getDocument()), this.tokenRe = mode.tokenRe, this.nonTokenRe = mode.nonTokenRe, $isPlaceholder || (mode.attachToSession && mode.attachToSession(this), this.$options.wrapMethod.set.call(this, this.$wrapMethod), this.$setFolding(mode.foldingRules), this.bgTokenizer.start(0), this._emit("changeMode", {
                                oldMode: oldMode,
                                mode: mode
                            }));
                        }
                    }, this.$stopWorker = function() {
                        this.$worker && (this.$worker.terminate(), this.$worker = null);
                    }, this.$startWorker = function() {
                        try {
                            this.$worker = this.$mode.createWorker(this);
                        } catch (e) {
                            config.warn("Could not load worker", e), this.$worker = null;
                        }
                    }, this.getMode = function() {
                        return this.$mode;
                    }, this.$scrollTop = 0, this.setScrollTop = function(scrollTop) {
                        this.$scrollTop === scrollTop || isNaN(scrollTop) || (this.$scrollTop = scrollTop, this._signal("changeScrollTop", scrollTop));
                    }, this.getScrollTop = function() {
                        return this.$scrollTop;
                    }, this.$scrollLeft = 0, this.setScrollLeft = function(scrollLeft) {
                        this.$scrollLeft === scrollLeft || isNaN(scrollLeft) || (this.$scrollLeft = scrollLeft, this._signal("changeScrollLeft", scrollLeft));
                    }, this.getScrollLeft = function() {
                        return this.$scrollLeft;
                    }, this.getScreenWidth = function() {
                        return (this.$computeWidth(), this.lineWidgets) ? Math.max(this.getLineWidgetMaxWidth(), this.screenWidth) : this.screenWidth;
                    }, this.getLineWidgetMaxWidth = function() {
                        if (null != this.lineWidgetsWidth) return this.lineWidgetsWidth;
                        var width = 0;
                        return this.lineWidgets.forEach(function(w) {
                            w && w.screenWidth > width && (width = w.screenWidth);
                        }), this.lineWidgetWidth = width;
                    }, this.$computeWidth = function(force) {
                        if (this.$modified || force) {
                            if (this.$modified = !1, this.$useWrapMode) return this.screenWidth = this.$wrapLimit;
                            for(var lines = this.doc.getAllLines(), cache = this.$rowLengthCache, longestScreenLine = 0, foldIndex = 0, foldLine = this.$foldData[foldIndex], foldStart = foldLine ? foldLine.start.row : 1 / 0, len = lines.length, i = 0; i < len; i++){
                                if (i > foldStart) {
                                    if ((i = foldLine.end.row + 1) >= len) break;
                                    foldStart = (foldLine = this.$foldData[foldIndex++]) ? foldLine.start.row : 1 / 0;
                                }
                                null == cache[i] && (cache[i] = this.$getStringScreenWidth(lines[i])[0]), cache[i] > longestScreenLine && (longestScreenLine = cache[i]);
                            }
                            this.screenWidth = longestScreenLine;
                        }
                    }, this.getLine = function(row) {
                        return this.doc.getLine(row);
                    }, this.getLines = function(firstRow, lastRow) {
                        return this.doc.getLines(firstRow, lastRow);
                    }, this.getLength = function() {
                        return this.doc.getLength();
                    }, this.getTextRange = function(range) {
                        return this.doc.getTextRange(range || this.selection.getRange());
                    }, this.insert = function(position, text) {
                        return this.doc.insert(position, text);
                    }, this.remove = function(range) {
                        return this.doc.remove(range);
                    }, this.removeFullLines = function(firstRow, lastRow) {
                        return this.doc.removeFullLines(firstRow, lastRow);
                    }, this.undoChanges = function(deltas, dontSelect) {
                        if (deltas.length) {
                            this.$fromUndo = !0;
                            for(var i = deltas.length - 1; -1 != i; i--){
                                var delta = deltas[i];
                                "insert" == delta.action || "remove" == delta.action ? this.doc.revertDelta(delta) : delta.folds && this.addFolds(delta.folds);
                            }
                            !dontSelect && this.$undoSelect && (deltas.selectionBefore ? this.selection.fromJSON(deltas.selectionBefore) : this.selection.setRange(this.$getUndoSelection(deltas, !0))), this.$fromUndo = !1;
                        }
                    }, this.redoChanges = function(deltas, dontSelect) {
                        if (deltas.length) {
                            this.$fromUndo = !0;
                            for(var i = 0; i < deltas.length; i++){
                                var delta = deltas[i];
                                ("insert" == delta.action || "remove" == delta.action) && this.doc.$safeApplyDelta(delta);
                            }
                            !dontSelect && this.$undoSelect && (deltas.selectionAfter ? this.selection.fromJSON(deltas.selectionAfter) : this.selection.setRange(this.$getUndoSelection(deltas, !1))), this.$fromUndo = !1;
                        }
                    }, this.setUndoSelect = function(enable) {
                        this.$undoSelect = enable;
                    }, this.$getUndoSelection = function(deltas, isUndo) {
                        function isInsert(delta) {
                            return isUndo ? "insert" !== delta.action : "insert" === delta.action;
                        }
                        for(var range, point, i = 0; i < deltas.length; i++){
                            var delta = deltas[i];
                            if (delta.start) {
                                if (!range) {
                                    range = isInsert(delta) ? Range.fromPoints(delta.start, delta.end) : Range.fromPoints(delta.start, delta.start);
                                    continue;
                                }
                                isInsert(delta) ? (point = delta.start, -1 == range.compare(point.row, point.column) && range.setStart(point), point = delta.end, 1 == range.compare(point.row, point.column) && range.setEnd(point)) : (point = delta.start, -1 == range.compare(point.row, point.column) && (range = Range.fromPoints(delta.start, delta.start)));
                            } // skip folds
                        }
                        return range;
                    }, this.replace = function(range, text) {
                        return this.doc.replace(range, text);
                    }, this.moveText = function(fromRange, toPosition, copy) {
                        var text = this.getTextRange(fromRange), folds = this.getFoldsInRange(fromRange), toRange = Range.fromPoints(toPosition, toPosition);
                        if (!copy) {
                            this.remove(fromRange);
                            var rowDiff = fromRange.start.row - fromRange.end.row, collDiff = rowDiff ? -fromRange.end.column : fromRange.start.column - fromRange.end.column;
                            collDiff && (toRange.start.row == fromRange.end.row && toRange.start.column > fromRange.end.column && (toRange.start.column += collDiff), toRange.end.row == fromRange.end.row && toRange.end.column > fromRange.end.column && (toRange.end.column += collDiff)), rowDiff && toRange.start.row >= fromRange.end.row && (toRange.start.row += rowDiff, toRange.end.row += rowDiff);
                        }
                        if (toRange.end = this.insert(toRange.start, text), folds.length) {
                            var oldStart = fromRange.start, newStart = toRange.start, rowDiff = newStart.row - oldStart.row, collDiff = newStart.column - oldStart.column;
                            this.addFolds(folds.map(function(x) {
                                return (x = x.clone()).start.row == oldStart.row && (x.start.column += collDiff), x.end.row == oldStart.row && (x.end.column += collDiff), x.start.row += rowDiff, x.end.row += rowDiff, x;
                            }));
                        }
                        return toRange;
                    }, this.indentRows = function(startRow, endRow, indentString) {
                        indentString = indentString.replace(/\t/g, this.getTabString());
                        for(var row = startRow; row <= endRow; row++)this.doc.insertInLine({
                            row: row,
                            column: 0
                        }, indentString);
                    }, this.outdentRows = function(range) {
                        for(var rowRange = range.collapseRows(), deleteRange = new Range(0, 0, 0, 0), size = this.getTabSize(), i = rowRange.start.row; i <= rowRange.end.row; ++i){
                            var line = this.getLine(i);
                            deleteRange.start.row = i, deleteRange.end.row = i;
                            for(var j = 0; j < size && " " == line.charAt(j); ++j);
                            j < size && "\t" == line.charAt(j) ? (deleteRange.start.column = j, deleteRange.end.column = j + 1) : (deleteRange.start.column = 0, deleteRange.end.column = j), this.remove(deleteRange);
                        }
                    }, this.$moveLines = function(firstRow, lastRow, dir) {
                        if (firstRow = this.getRowFoldStart(firstRow), lastRow = this.getRowFoldEnd(lastRow), dir < 0) {
                            var row = this.getRowFoldStart(firstRow + dir);
                            if (row < 0) return 0;
                            var diff = row - firstRow;
                        } else if (dir > 0) {
                            var row = this.getRowFoldEnd(lastRow + dir);
                            if (row > this.doc.getLength() - 1) return 0;
                            var diff = row - lastRow;
                        } else {
                            firstRow = this.$clipRowToDocument(firstRow);
                            var diff = (lastRow = this.$clipRowToDocument(lastRow)) - firstRow + 1;
                        }
                        var range = new Range(firstRow, 0, lastRow, Number.MAX_VALUE), folds = this.getFoldsInRange(range).map(function(x) {
                            return x = x.clone(), x.start.row += diff, x.end.row += diff, x;
                        }), lines = 0 == dir ? this.doc.getLines(firstRow, lastRow) : this.doc.removeFullLines(firstRow, lastRow);
                        return this.doc.insertFullLines(firstRow + diff, lines), folds.length && this.addFolds(folds), diff;
                    }, this.moveLinesUp = function(firstRow, lastRow) {
                        return this.$moveLines(firstRow, lastRow, -1);
                    }, this.moveLinesDown = function(firstRow, lastRow) {
                        return this.$moveLines(firstRow, lastRow, 1);
                    }, this.duplicateLines = function(firstRow, lastRow) {
                        return this.$moveLines(firstRow, lastRow, 0);
                    }, this.$clipRowToDocument = function(row) {
                        return Math.max(0, Math.min(row, this.doc.getLength() - 1));
                    }, this.$clipColumnToRow = function(row, column) {
                        return column < 0 ? 0 : Math.min(this.doc.getLine(row).length, column);
                    }, this.$clipPositionToDocument = function(row, column) {
                        if (column = Math.max(0, column), row < 0) row = 0, column = 0;
                        else {
                            var len = this.doc.getLength();
                            row >= len ? (row = len - 1, column = this.doc.getLine(len - 1).length) : column = Math.min(this.doc.getLine(row).length, column);
                        }
                        return {
                            row: row,
                            column: column
                        };
                    }, this.$clipRangeToDocument = function(range) {
                        range.start.row < 0 ? (range.start.row = 0, range.start.column = 0) : range.start.column = this.$clipColumnToRow(range.start.row, range.start.column);
                        var len = this.doc.getLength() - 1;
                        return range.end.row > len ? (range.end.row = len, range.end.column = this.doc.getLine(len).length) : range.end.column = this.$clipColumnToRow(range.end.row, range.end.column), range;
                    }, this.$wrapLimit = 80, this.$useWrapMode = !1, this.$wrapLimitRange = {
                        min: null,
                        max: null
                    }, this.setUseWrapMode = function(useWrapMode) {
                        if (useWrapMode != this.$useWrapMode) {
                            if (this.$useWrapMode = useWrapMode, this.$modified = !0, this.$resetRowCache(0), useWrapMode) {
                                var len = this.getLength();
                                this.$wrapData = Array(len), this.$updateWrapData(0, len - 1);
                            }
                            this._signal("changeWrapMode");
                        }
                    }, this.getUseWrapMode = function() {
                        return this.$useWrapMode;
                    }, this.setWrapLimitRange = function(min, max) {
                        (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) && (this.$wrapLimitRange = {
                            min: min,
                            max: max
                        }, this.$modified = !0, this.$bidiHandler.markAsDirty(), this.$useWrapMode && this._signal("changeWrapMode"));
                    }, this.adjustWrapLimit = function(desiredLimit, $printMargin) {
                        var limits = this.$wrapLimitRange;
                        limits.max < 0 && (limits = {
                            min: $printMargin,
                            max: $printMargin
                        });
                        var wrapLimit = this.$constrainWrapLimit(desiredLimit, limits.min, limits.max);
                        return wrapLimit != this.$wrapLimit && wrapLimit > 1 && (this.$wrapLimit = wrapLimit, this.$modified = !0, this.$useWrapMode && (this.$updateWrapData(0, this.getLength() - 1), this.$resetRowCache(0), this._signal("changeWrapLimit")), !0);
                    }, this.$constrainWrapLimit = function(wrapLimit, min, max) {
                        return min && (wrapLimit = Math.max(min, wrapLimit)), max && (wrapLimit = Math.min(max, wrapLimit)), wrapLimit;
                    }, this.getWrapLimit = function() {
                        return this.$wrapLimit;
                    }, this.setWrapLimit = function(limit) {
                        this.setWrapLimitRange(limit, limit);
                    }, this.getWrapLimitRange = function() {
                        return {
                            min: this.$wrapLimitRange.min,
                            max: this.$wrapLimitRange.max
                        };
                    }, this.$updateInternalDataOnChange = function(delta) {
                        var useWrapMode = this.$useWrapMode, action = delta.action, start = delta.start, end = delta.end, firstRow = start.row, lastRow = end.row, len = lastRow - firstRow, removedFolds = null;
                        if (this.$updating = !0, 0 != len) {
                            if ("remove" === action) {
                                this[useWrapMode ? "$wrapData" : "$rowLengthCache"].splice(firstRow, len);
                                var foldLines = this.$foldData;
                                removedFolds = this.getFoldsInRange(delta), this.removeFolds(removedFolds);
                                var foldLine = this.getFoldLine(end.row), idx = 0;
                                if (foldLine) {
                                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column), foldLine.shiftRow(-len);
                                    var foldLineBefore = this.getFoldLine(firstRow);
                                    foldLineBefore && foldLineBefore !== foldLine && (foldLineBefore.merge(foldLine), foldLine = foldLineBefore), idx = foldLines.indexOf(foldLine) + 1;
                                }
                                for(; idx < foldLines.length; idx++){
                                    var foldLine = foldLines[idx];
                                    foldLine.start.row >= end.row && foldLine.shiftRow(-len);
                                }
                                lastRow = firstRow;
                            } else {
                                var args = Array(len);
                                args.unshift(firstRow, 0);
                                var arr = useWrapMode ? this.$wrapData : this.$rowLengthCache;
                                arr.splice.apply(arr, args);
                                var foldLines = this.$foldData, foldLine = this.getFoldLine(firstRow), idx = 0;
                                if (foldLine) {
                                    var cmp = foldLine.range.compareInside(start.row, start.column);
                                    0 == cmp ? (foldLine = foldLine.split(start.row, start.column)) && (foldLine.shiftRow(len), foldLine.addRemoveChars(lastRow, 0, end.column - start.column)) : -1 == cmp && (foldLine.addRemoveChars(firstRow, 0, end.column - start.column), foldLine.shiftRow(len)), idx = foldLines.indexOf(foldLine) + 1;
                                }
                                for(; idx < foldLines.length; idx++){
                                    var foldLine = foldLines[idx];
                                    foldLine.start.row >= firstRow && foldLine.shiftRow(len);
                                }
                            }
                        } else {
                            len = Math.abs(delta.start.column - delta.end.column), "remove" === action && (removedFolds = this.getFoldsInRange(delta), this.removeFolds(removedFolds), len = -len);
                            var foldLine = this.getFoldLine(firstRow);
                            foldLine && foldLine.addRemoveChars(firstRow, start.column, len);
                        }
                        return useWrapMode && this.$wrapData.length != this.doc.getLength() && console.error("doc.getLength() and $wrapData.length have to be the same!"), this.$updating = !1, useWrapMode ? this.$updateWrapData(firstRow, lastRow) : this.$updateRowLengthCache(firstRow, lastRow), removedFolds;
                    }, this.$updateRowLengthCache = function(firstRow, lastRow, b) {
                        this.$rowLengthCache[firstRow] = null, this.$rowLengthCache[lastRow] = null;
                    }, this.$updateWrapData = function(firstRow, lastRow) {
                        var tokens, foldLine, lines = this.doc.getAllLines(), tabSize = this.getTabSize(), wrapData = this.$wrapData, wrapLimit = this.$wrapLimit, row = firstRow;
                        for(lastRow = Math.min(lastRow, lines.length - 1); row <= lastRow;)(foldLine = this.getFoldLine(row, foldLine)) ? (tokens = [], foldLine.walk((function(placeholder, row, column, lastColumn) {
                            var walkTokens;
                            if (null != placeholder) {
                                (walkTokens = this.$getDisplayTokens(placeholder, tokens.length))[0] = PLACEHOLDER_START;
                                for(var i = 1; i < walkTokens.length; i++)walkTokens[i] = PLACEHOLDER_BODY;
                            } else walkTokens = this.$getDisplayTokens(lines[row].substring(lastColumn, column), tokens.length);
                            tokens = tokens.concat(walkTokens);
                        }).bind(this), foldLine.end.row, lines[foldLine.end.row].length + 1), wrapData[foldLine.start.row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize), row = foldLine.end.row + 1) : (tokens = this.$getDisplayTokens(lines[row]), wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize), row++);
                    };
                    var PLACEHOLDER_START = 3, PLACEHOLDER_BODY = 4;
                    function isFullWidth(c) {
                        return !(c < 0x1100) && (c >= 0x1100 && c <= 0x115f || c >= 0x11a3 && c <= 0x11a7 || c >= 0x11fa && c <= 0x11ff || c >= 0x2329 && c <= 0x232a || c >= 0x2e80 && c <= 0x2e99 || c >= 0x2e9b && c <= 0x2ef3 || c >= 0x2f00 && c <= 0x2fd5 || c >= 0x2ff0 && c <= 0x2ffb || c >= 0x3000 && c <= 0x303e || c >= 0x3041 && c <= 0x3096 || c >= 0x3099 && c <= 0x30ff || c >= 0x3105 && c <= 0x312d || c >= 0x3131 && c <= 0x318e || c >= 0x3190 && c <= 0x31ba || c >= 0x31c0 && c <= 0x31e3 || c >= 0x31f0 && c <= 0x321e || c >= 0x3220 && c <= 0x3247 || c >= 0x3250 && c <= 0x32fe || c >= 0x3300 && c <= 0x4dbf || c >= 0x4e00 && c <= 0xa48c || c >= 0xa490 && c <= 0xa4c6 || c >= 0xa960 && c <= 0xa97c || c >= 0xac00 && c <= 0xd7a3 || c >= 0xd7b0 && c <= 0xd7c6 || c >= 0xd7cb && c <= 0xd7fb || c >= 0xf900 && c <= 0xfaff || c >= 0xfe10 && c <= 0xfe19 || c >= 0xfe30 && c <= 0xfe52 || c >= 0xfe54 && c <= 0xfe66 || c >= 0xfe68 && c <= 0xfe6b || c >= 0xff01 && c <= 0xff60 || c >= 0xffe0 && c <= 0xffe6);
                    }
                    this.$computeWrapSplits = function(tokens, wrapLimit, tabSize) {
                        if (0 == tokens.length) return [];
                        var splits = [], displayLength = tokens.length, lastSplit = 0, lastDocSplit = 0, isCode = this.$wrapAsCode, indentedSoftWrap = this.$indentedSoftWrap, maxIndent = wrapLimit <= Math.max(2 * tabSize, 8) || !1 === indentedSoftWrap ? 0 : Math.floor(wrapLimit / 2);
                        function addSplit(screenPos) {
                            for(var len = screenPos - lastSplit, i = lastSplit; i < screenPos; i++){
                                var ch = tokens[i];
                                (12 === ch || 2 === ch) && (len -= 1);
                            }
                            splits.length || (indent = function() {
                                var indentation = 0;
                                if (0 === maxIndent) return indentation;
                                if (indentedSoftWrap) for(var i = 0; i < tokens.length; i++){
                                    var token = tokens[i];
                                    if (10 == token) indentation += 1;
                                    else if (11 == token) indentation += tabSize;
                                    else if (12 == token) continue;
                                    else break;
                                }
                                return isCode && !1 !== indentedSoftWrap && (indentation += tabSize), Math.min(indentation, maxIndent);
                            }(), splits.indent = indent), lastDocSplit += len, splits.push(lastDocSplit), lastSplit = screenPos;
                        }
                        for(var indent = 0; displayLength - lastSplit > wrapLimit - indent;){
                            var split = lastSplit + wrapLimit - indent;
                            if (tokens[split - 1] >= 10 && tokens[split] >= 10) {
                                addSplit(split);
                                continue;
                            }
                            if (tokens[split] == PLACEHOLDER_START || tokens[split] == PLACEHOLDER_BODY) {
                                for(; split != lastSplit - 1 && tokens[split] != PLACEHOLDER_START; split--);
                                if (split > lastSplit) {
                                    addSplit(split);
                                    continue;
                                }
                                for(split = lastSplit + wrapLimit; split < tokens.length && tokens[split] == PLACEHOLDER_BODY; split++);
                                if (split == tokens.length) break; // Breaks the while-loop.
                                addSplit(split);
                                continue;
                            }
                            for(var minSplit = Math.max(split - (wrapLimit - (wrapLimit >> 2)), lastSplit - 1); split > minSplit && tokens[split] < PLACEHOLDER_START;)split--;
                            if (isCode) {
                                for(; split > minSplit && tokens[split] < PLACEHOLDER_START;)split--;
                                for(; split > minSplit && 9 == tokens[split];)split--;
                            } else for(; split > minSplit && tokens[split] < 10;)split--;
                            if (split > minSplit) {
                                addSplit(++split);
                                continue;
                            }
                            2 == tokens[split = lastSplit + wrapLimit] && split--, addSplit(split - indent);
                        }
                        return splits;
                    }, this.$getDisplayTokens = function(str, offset) {
                        var tabSize, arr = [];
                        offset = offset || 0;
                        for(var i = 0; i < str.length; i++){
                            var c = str.charCodeAt(i);
                            if (9 == c) {
                                tabSize = this.getScreenTabSize(arr.length + offset), arr.push(11);
                                for(var n = 1; n < tabSize; n++)arr.push(12);
                            } else 32 == c ? arr.push(10) : c > 39 && c < 48 || c > 57 && c < 64 ? arr.push(9) : c >= 0x1100 && isFullWidth(c) ? arr.push(1, 2) : arr.push(1);
                        }
                        return arr;
                    }, this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
                        var c, column;
                        if (0 == maxScreenColumn) return [
                            0,
                            0
                        ];
                        for(null == maxScreenColumn && (maxScreenColumn = 1 / 0), screenColumn = screenColumn || 0, column = 0; column < str.length && (9 == (c = str.charCodeAt(column)) ? screenColumn += this.getScreenTabSize(screenColumn) : c >= 0x1100 && isFullWidth(c) ? screenColumn += 2 : screenColumn += 1, !(screenColumn > maxScreenColumn)); column++);
                        return [
                            screenColumn,
                            column
                        ];
                    }, this.lineWidgets = null, this.getRowLength = function(row) {
                        var h = 1;
                        return (this.lineWidgets && (h += this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0), this.$useWrapMode && this.$wrapData[row]) ? this.$wrapData[row].length + h : h;
                    }, this.getRowLineCount = function(row) {
                        return this.$useWrapMode && this.$wrapData[row] ? this.$wrapData[row].length + 1 : 1;
                    }, this.getRowWrapIndent = function(screenRow) {
                        if (!this.$useWrapMode) return 0;
                        var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE), splits = this.$wrapData[pos.row];
                        return splits.length && splits[0] < pos.column ? splits.indent : 0;
                    }, this.getScreenLastRowColumn = function(screenRow) {
                        var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
                        return this.documentToScreenColumn(pos.row, pos.column);
                    }, this.getDocumentLastRowColumn = function(docRow, docColumn) {
                        var screenRow = this.documentToScreenRow(docRow, docColumn);
                        return this.getScreenLastRowColumn(screenRow);
                    }, this.getDocumentLastRowColumnPosition = function(docRow, docColumn) {
                        var screenRow = this.documentToScreenRow(docRow, docColumn);
                        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
                    }, this.getRowSplitData = function(row) {
                        if (this.$useWrapMode) return this.$wrapData[row];
                    }, this.getScreenTabSize = function(screenColumn) {
                        return this.$tabSize - (screenColumn % this.$tabSize | 0);
                    }, this.screenToDocumentRow = function(screenRow, screenColumn) {
                        return this.screenToDocumentPosition(screenRow, screenColumn).row;
                    }, this.screenToDocumentColumn = function(screenRow, screenColumn) {
                        return this.screenToDocumentPosition(screenRow, screenColumn).column;
                    }, this.screenToDocumentPosition = function(screenRow, screenColumn, offsetX) {
                        if (screenRow < 0) return {
                            row: 0,
                            column: 0
                        };
                        var line, column, docRow = 0, docColumn = 0, row = 0, rowLength = 0, rowCache = this.$screenRowCache, i = this.$getRowCacheIndex(rowCache, screenRow), l = rowCache.length;
                        if (l && i >= 0) var row = rowCache[i], docRow = this.$docRowCache[i], doCache = screenRow > rowCache[l - 1];
                        else var doCache = !l;
                        for(var maxRow = this.getLength() - 1, foldLine = this.getNextFoldLine(docRow), foldStart = foldLine ? foldLine.start.row : 1 / 0; row <= screenRow && !(row + (rowLength = this.getRowLength(docRow)) > screenRow) && !(docRow >= maxRow);)row += rowLength, ++docRow > foldStart && (docRow = foldLine.end.row + 1, foldStart = (foldLine = this.getNextFoldLine(docRow, foldLine)) ? foldLine.start.row : 1 / 0), doCache && (this.$docRowCache.push(docRow), this.$screenRowCache.push(row));
                        if (foldLine && foldLine.start.row <= docRow) line = this.getFoldDisplayLine(foldLine), docRow = foldLine.start.row;
                        else {
                            if (row + rowLength <= screenRow || docRow > maxRow) return {
                                row: maxRow,
                                column: this.getLine(maxRow).length
                            };
                            line = this.getLine(docRow), foldLine = null;
                        }
                        var wrapIndent = 0, splitIndex = Math.floor(screenRow - row);
                        if (this.$useWrapMode) {
                            var splits = this.$wrapData[docRow];
                            splits && (column = splits[splitIndex], splitIndex > 0 && splits.length && (wrapIndent = splits.indent, docColumn = splits[splitIndex - 1] || splits[splits.length - 1], line = line.substring(docColumn)));
                        }
                        return (void 0 !== offsetX && this.$bidiHandler.isBidiRow(row + splitIndex, docRow, splitIndex) && (screenColumn = this.$bidiHandler.offsetToCol(offsetX)), docColumn += this.$getStringScreenWidth(line, screenColumn - wrapIndent)[1], this.$useWrapMode && docColumn >= column && (docColumn = column - 1), foldLine) ? foldLine.idxToPosition(docColumn) : {
                            row: docRow,
                            column: docColumn
                        };
                    }, this.documentToScreenPosition = function(docRow, docColumn) {
                        if (void 0 === docColumn) var pos = this.$clipPositionToDocument(docRow.row, docRow.column);
                        else pos = this.$clipPositionToDocument(docRow, docColumn);
                        docRow = pos.row, docColumn = pos.column;
                        var screenRow = 0, foldStartRow = null, fold = null;
                        (fold = this.getFoldAt(docRow, docColumn, 1)) && (docRow = fold.start.row, docColumn = fold.start.column);
                        var rowEnd, row = 0, rowCache = this.$docRowCache, i = this.$getRowCacheIndex(rowCache, docRow), l = rowCache.length;
                        if (l && i >= 0) var row = rowCache[i], screenRow = this.$screenRowCache[i], doCache = docRow > rowCache[l - 1];
                        else var doCache = !l;
                        for(var foldLine = this.getNextFoldLine(row), foldStart = foldLine ? foldLine.start.row : 1 / 0; row < docRow;){
                            if (row >= foldStart) {
                                if ((rowEnd = foldLine.end.row + 1) > docRow) break;
                                foldStart = (foldLine = this.getNextFoldLine(rowEnd, foldLine)) ? foldLine.start.row : 1 / 0;
                            } else rowEnd = row + 1;
                            screenRow += this.getRowLength(row), row = rowEnd, doCache && (this.$docRowCache.push(row), this.$screenRowCache.push(screenRow));
                        }
                        var textLine = "";
                        foldLine && row >= foldStart ? (textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn), foldStartRow = foldLine.start.row) : (textLine = this.getLine(docRow).substring(0, docColumn), foldStartRow = docRow);
                        var wrapIndent = 0;
                        if (this.$useWrapMode) {
                            var wrapRow = this.$wrapData[foldStartRow];
                            if (wrapRow) {
                                for(var screenRowOffset = 0; textLine.length >= wrapRow[screenRowOffset];)screenRow++, screenRowOffset++;
                                textLine = textLine.substring(wrapRow[screenRowOffset - 1] || 0, textLine.length), wrapIndent = screenRowOffset > 0 ? wrapRow.indent : 0;
                            }
                        }
                        return this.lineWidgets && this.lineWidgets[row] && this.lineWidgets[row].rowsAbove && (screenRow += this.lineWidgets[row].rowsAbove), {
                            row: screenRow,
                            column: wrapIndent + this.$getStringScreenWidth(textLine)[0]
                        };
                    }, this.documentToScreenColumn = function(row, docColumn) {
                        return this.documentToScreenPosition(row, docColumn).column;
                    }, this.documentToScreenRow = function(docRow, docColumn) {
                        return this.documentToScreenPosition(docRow, docColumn).row;
                    }, this.getScreenLength = function() {
                        var screenRows = 0, fold = null;
                        if (this.$useWrapMode) for(var lastRow = this.$wrapData.length, row = 0, i = 0, fold = this.$foldData[i++], foldStart = fold ? fold.start.row : 1 / 0; row < lastRow;){
                            var splits = this.$wrapData[row];
                            screenRows += splits ? splits.length + 1 : 1, ++row > foldStart && (row = fold.end.row + 1, foldStart = (fold = this.$foldData[i++]) ? fold.start.row : 1 / 0);
                        }
                        else {
                            screenRows = this.getLength();
                            for(var foldData = this.$foldData, i = 0; i < foldData.length; i++)screenRows -= (fold = foldData[i]).end.row - fold.start.row;
                        }
                        return this.lineWidgets && (screenRows += this.$getWidgetScreenLength()), screenRows;
                    }, this.$setFontMetrics = function(fm) {
                        this.$enableVarChar && (this.$getStringScreenWidth = function(str, maxScreenColumn, screenColumn) {
                            var c, column;
                            if (0 === maxScreenColumn) return [
                                0,
                                0
                            ];
                            for(maxScreenColumn || (maxScreenColumn = 1 / 0), screenColumn = screenColumn || 0, column = 0; column < str.length && ("\t" === (c = str.charAt(column)) ? screenColumn += this.getScreenTabSize(screenColumn) : screenColumn += fm.getCharacterWidth(c), !(screenColumn > maxScreenColumn)); column++);
                            return [
                                screenColumn,
                                column
                            ];
                        });
                    }, this.destroy = function() {
                        this.bgTokenizer && (this.bgTokenizer.setDocument(null), this.bgTokenizer = null), this.$stopWorker(), this.removeAllListeners(), this.doc && this.doc.off("change", this.$onChange), this.selection.detach();
                    }, this.isFullWidth = isFullWidth;
                }).call(EditSession.prototype), require("./edit_session/folding").Folding.call(EditSession.prototype), require("./edit_session/bracket_match").BracketMatch.call(EditSession.prototype), config.defineOptions(EditSession.prototype, "session", {
                    wrap: {
                        set: function(value) {
                            if (value && "off" != value ? "free" == value ? value = !0 : "printMargin" == value ? value = -1 : "string" == typeof value && (value = parseInt(value, 10) || !1) : value = !1, this.$wrap != value) {
                                if (this.$wrap = value, value) {
                                    var col = "number" == typeof value ? value : null;
                                    this.setWrapLimitRange(col, col), this.setUseWrapMode(!0);
                                } else this.setUseWrapMode(!1);
                            }
                        },
                        get: function() {
                            return this.getUseWrapMode() ? -1 == this.$wrap ? "printMargin" : this.getWrapLimitRange().min ? this.$wrap : "free" : "off";
                        },
                        handlesSet: !0
                    },
                    wrapMethod: {
                        set: function(val) {
                            (val = "auto" == val ? "text" != this.$mode.type : "text" != val) != this.$wrapAsCode && (this.$wrapAsCode = val, this.$useWrapMode && (this.$useWrapMode = !1, this.setUseWrapMode(!0)));
                        },
                        initialValue: "auto"
                    },
                    indentedSoftWrap: {
                        set: function() {
                            this.$useWrapMode && (this.$useWrapMode = !1, this.setUseWrapMode(!0));
                        },
                        initialValue: !0
                    },
                    firstLineNumber: {
                        set: function() {
                            this._signal("changeBreakpoint");
                        },
                        initialValue: 1
                    },
                    useWorker: {
                        set: function(useWorker) {
                            this.$useWorker = useWorker, this.$stopWorker(), useWorker && this.$startWorker();
                        },
                        initialValue: !0
                    },
                    useSoftTabs: {
                        initialValue: !0
                    },
                    tabSize: {
                        set: function(tabSize) {
                            (tabSize = parseInt(tabSize)) > 0 && this.$tabSize !== tabSize && (this.$modified = !0, this.$rowLengthCache = [], this.$tabSize = tabSize, this._signal("changeTabSize"));
                        },
                        initialValue: 4,
                        handlesSet: !0
                    },
                    navigateWithinSoftTabs: {
                        initialValue: !1
                    },
                    foldStyle: {
                        set: function(val) {
                            this.setFoldStyle(val);
                        },
                        handlesSet: !0
                    },
                    overwrite: {
                        set: function(val) {
                            this._signal("changeOverwrite");
                        },
                        initialValue: !1
                    },
                    newLineMode: {
                        set: function(val) {
                            this.doc.setNewLineMode(val);
                        },
                        get: function() {
                            return this.doc.getNewLineMode();
                        },
                        handlesSet: !0
                    },
                    mode: {
                        set: function(val) {
                            this.setMode(val);
                        },
                        get: function() {
                            return this.$modeId;
                        },
                        handlesSet: !0
                    }
                }), exports.EditSession = EditSession;
            }), ace.define("ace/search", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/lib/oop",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var lang = require("./lib/lang"), oop = require("./lib/oop"), Range = require("./range").Range, Search = function() {
                    this.$options = {};
                };
                (function() {
                    this.set = function(options) {
                        return oop.mixin(this.$options, options), this;
                    }, this.getOptions = function() {
                        return lang.copyObject(this.$options);
                    }, this.setOptions = function(options) {
                        this.$options = options;
                    }, this.find = function(session) {
                        var options = this.$options, iterator = this.$matchIterator(session, options);
                        if (!iterator) return !1;
                        var firstRange = null;
                        return iterator.forEach(function(sr, sc, er, ec) {
                            return firstRange = new Range(sr, sc, er, ec), !(sc == ec && options.start && options.start.start && !1 != options.skipCurrent && firstRange.isEqual(options.start)) || (firstRange = null, !1);
                        }), firstRange;
                    }, this.findAll = function(session) {
                        var options = this.$options;
                        if (!options.needle) return [];
                        this.$assembleRegExp(options);
                        var range = options.range, lines = range ? session.getLines(range.start.row, range.end.row) : session.doc.getAllLines(), ranges = [], re = options.re;
                        if (options.$isMultiLine) {
                            var prevRange, len = re.length, maxRow = lines.length - len;
                            outer: for(var row = re.offset || 0; row <= maxRow; row++){
                                for(var j = 0; j < len; j++)if (-1 == lines[row + j].search(re[j])) continue outer;
                                var startLine = lines[row], line = lines[row + len - 1], startIndex = startLine.length - startLine.match(re[0])[0].length, endIndex = line.match(re[len - 1])[0].length;
                                prevRange && prevRange.end.row === row && prevRange.end.column > startIndex || (ranges.push(prevRange = new Range(row, startIndex, row + len - 1, endIndex)), len > 2 && (row = row + len - 2));
                            }
                        } else for(var i = 0; i < lines.length; i++)for(var matches = lang.getMatchOffsets(lines[i], re), j = 0; j < matches.length; j++){
                            var match = matches[j];
                            ranges.push(new Range(i, match.offset, i, match.offset + match.length));
                        }
                        if (range) {
                            for(var startColumn = range.start.column, endColumn = range.start.column, i = 0, j = ranges.length - 1; i < j && ranges[i].start.column < startColumn && ranges[i].start.row == range.start.row;)i++;
                            for(; i < j && ranges[j].end.column > endColumn && ranges[j].end.row == range.end.row;)j--;
                            for(ranges = ranges.slice(i, j + 1), i = 0, j = ranges.length; i < j; i++)ranges[i].start.row += range.start.row, ranges[i].end.row += range.start.row;
                        }
                        return ranges;
                    }, this.replace = function(input, replacement) {
                        var options = this.$options, re = this.$assembleRegExp(options);
                        if (options.$isMultiLine) return replacement;
                        if (re) {
                            var match = re.exec(input);
                            if (!match || match[0].length != input.length) return null;
                            if (replacement = input.replace(re, replacement), options.preserveCase) {
                                replacement = replacement.split("");
                                for(var i = Math.min(input.length, input.length); i--;){
                                    var ch = input[i];
                                    ch && ch.toLowerCase() != ch ? replacement[i] = replacement[i].toUpperCase() : replacement[i] = replacement[i].toLowerCase();
                                }
                                replacement = replacement.join("");
                            }
                            return replacement;
                        }
                    }, this.$assembleRegExp = function(options, $disableFakeMultiline) {
                        if (options.needle instanceof RegExp) return options.re = options.needle;
                        var needle = options.needle;
                        if (!options.needle) return options.re = !1;
                        options.regExp || (needle = lang.escapeRegExp(needle)), options.wholeWord && (needle = function(needle, options) {
                            function wordBoundary(c) {
                                return /\w/.test(c) || options.regExp ? "\\b" : "";
                            }
                            return wordBoundary(needle[0]) + needle + wordBoundary(needle[needle.length - 1]);
                        }(needle, options));
                        var modifier = options.caseSensitive ? "gm" : "gmi";
                        if (options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needle), options.$isMultiLine) return options.re = this.$assembleMultilineRegExp(needle, modifier);
                        try {
                            var re = new RegExp(needle, modifier);
                        } catch (e) {
                            re = !1;
                        }
                        return options.re = re;
                    }, this.$assembleMultilineRegExp = function(needle, modifier) {
                        for(var parts = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n"), re = [], i = 0; i < parts.length; i++)try {
                            re.push(new RegExp(parts[i], modifier));
                        } catch (e) {
                            return !1;
                        }
                        return re;
                    }, this.$matchIterator = function(session, options) {
                        var re = this.$assembleRegExp(options);
                        if (!re) return !1;
                        var backwards = !0 == options.backwards, skipCurrent = !1 != options.skipCurrent, range = options.range, start = options.start;
                        start || (start = range ? range[backwards ? "end" : "start"] : session.selection.getRange()), start.start && (start = start[skipCurrent != backwards ? "end" : "start"]);
                        var firstRow = range ? range.start.row : 0, lastRow = range ? range.end.row : session.getLength() - 1;
                        if (backwards) var forEach = function(callback) {
                            var row = start.row;
                            if (!forEachInLine(row, start.column, callback)) {
                                for(row--; row >= firstRow; row--)if (forEachInLine(row, Number.MAX_VALUE, callback)) return;
                                if (!1 != options.wrap) {
                                    for(row = lastRow, firstRow = start.row; row >= firstRow; row--)if (forEachInLine(row, Number.MAX_VALUE, callback)) return;
                                }
                            }
                        };
                        else var forEach = function(callback) {
                            var row = start.row;
                            if (!forEachInLine(row, start.column, callback)) {
                                for(row += 1; row <= lastRow; row++)if (forEachInLine(row, 0, callback)) return;
                                if (!1 != options.wrap) {
                                    for(row = firstRow, lastRow = start.row; row <= lastRow; row++)if (forEachInLine(row, 0, callback)) return;
                                }
                            }
                        };
                        if (options.$isMultiLine) var len = re.length, forEachInLine = function(row, offset, callback) {
                            var startRow = backwards ? row - len + 1 : row;
                            if (!(startRow < 0 || startRow + len > session.getLength())) {
                                var line = session.getLine(startRow), startIndex = line.search(re[0]);
                                if ((backwards || !(startIndex < offset)) && -1 !== startIndex) {
                                    for(var i = 1; i < len; i++)if (-1 == (line = session.getLine(startRow + i)).search(re[i])) return;
                                    var endIndex = line.match(re[len - 1])[0].length;
                                    if ((!backwards || !(endIndex > offset)) && callback(startRow, startIndex, startRow + len - 1, endIndex)) return !0;
                                }
                            }
                        };
                        else if (backwards) var forEachInLine = function(row, endIndex, callback) {
                            var m, line = session.getLine(row), matches = [], last = 0;
                            for(re.lastIndex = 0; m = re.exec(line);){
                                var length = m[0].length;
                                if (last = m.index, !length) {
                                    if (last >= line.length) break;
                                    re.lastIndex = last += 1;
                                }
                                if (m.index + length > endIndex) break;
                                matches.push(m.index, length);
                            }
                            for(var i = matches.length - 1; i >= 0; i -= 2){
                                var column = matches[i - 1], length = matches[i];
                                if (callback(row, column, row, column + length)) return !0;
                            }
                        };
                        else var forEachInLine = function(row, startIndex, callback) {
                            var last, m, line = session.getLine(row);
                            for(re.lastIndex = startIndex; m = re.exec(line);){
                                var length = m[0].length;
                                if (callback(row, last = m.index, row, last + length)) return !0;
                                if (!length && (re.lastIndex = last += 1, last >= line.length)) return !1;
                            }
                        };
                        return {
                            forEach: forEach
                        };
                    };
                }).call(Search.prototype), exports.Search = Search;
            }), ace.define("ace/keyboard/hash_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/keys",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var keyUtil = require("../lib/keys"), useragent = require("../lib/useragent"), KEY_MODS = keyUtil.KEY_MODS;
                function HashHandler(config, platform) {
                    this.platform = platform || (useragent.isMac ? "mac" : "win"), this.commands = {}, this.commandKeyBinding = {}, this.addCommands(config), this.$singleCommand = !0;
                }
                function MultiHashHandler(config, platform) {
                    HashHandler.call(this, config, platform), this.$singleCommand = !1;
                }
                MultiHashHandler.prototype = HashHandler.prototype, (function() {
                    function getPosition(command) {
                        return "object" == typeof command && command.bindKey && command.bindKey.position || (command.isDefault ? -100 : 0);
                    }
                    this.addCommand = function(command) {
                        this.commands[command.name] && this.removeCommand(command), this.commands[command.name] = command, command.bindKey && this._buildKeyHash(command);
                    }, this.removeCommand = function(command, keepCommand) {
                        var name = command && ("string" == typeof command ? command : command.name);
                        command = this.commands[name], keepCommand || delete this.commands[name];
                        var ckb = this.commandKeyBinding;
                        for(var keyId in ckb){
                            var cmdGroup = ckb[keyId];
                            if (cmdGroup == command) delete ckb[keyId];
                            else if (Array.isArray(cmdGroup)) {
                                var i = cmdGroup.indexOf(command);
                                -1 != i && (cmdGroup.splice(i, 1), 1 == cmdGroup.length && (ckb[keyId] = cmdGroup[0]));
                            }
                        }
                    }, this.bindKey = function(key, command, position) {
                        if ("object" == typeof key && key && (void 0 == position && (position = key.position), key = key[this.platform]), key) {
                            if ("function" == typeof command) return this.addCommand({
                                exec: command,
                                bindKey: key,
                                name: command.name || key
                            });
                            key.split("|").forEach(function(keyPart) {
                                var chain = "";
                                if (-1 != keyPart.indexOf(" ")) {
                                    var parts = keyPart.split(/\s+/);
                                    keyPart = parts.pop(), parts.forEach(function(keyPart) {
                                        var binding = this.parseKeys(keyPart), id = KEY_MODS[binding.hashId] + binding.key;
                                        chain += (chain ? " " : "") + id, this._addCommandToBinding(chain, "chainKeys");
                                    }, this), chain += " ";
                                }
                                var binding = this.parseKeys(keyPart), id = KEY_MODS[binding.hashId] + binding.key;
                                this._addCommandToBinding(chain + id, command, position);
                            }, this);
                        }
                    }, this._addCommandToBinding = function(keyId, command, position) {
                        var i, ckb = this.commandKeyBinding;
                        if (command) {
                            if (!ckb[keyId] || this.$singleCommand) ckb[keyId] = command;
                            else {
                                Array.isArray(ckb[keyId]) ? -1 != (i = ckb[keyId].indexOf(command)) && ckb[keyId].splice(i, 1) : ckb[keyId] = [
                                    ckb[keyId]
                                ], "number" != typeof position && (position = getPosition(command));
                                var commands = ckb[keyId];
                                for(i = 0; i < commands.length && !(getPosition(commands[i]) > position); i++);
                                commands.splice(i, 0, command);
                            }
                        } else delete ckb[keyId];
                    }, this.addCommands = function(commands) {
                        commands && Object.keys(commands).forEach(function(name) {
                            var command = commands[name];
                            if (command) {
                                if ("string" == typeof command) return this.bindKey(command, name);
                                "function" == typeof command && (command = {
                                    exec: command
                                }), "object" == typeof command && (command.name || (command.name = name), this.addCommand(command));
                            }
                        }, this);
                    }, this.removeCommands = function(commands) {
                        Object.keys(commands).forEach(function(name) {
                            this.removeCommand(commands[name]);
                        }, this);
                    }, this.bindKeys = function(keyList) {
                        Object.keys(keyList).forEach(function(key) {
                            this.bindKey(key, keyList[key]);
                        }, this);
                    }, this._buildKeyHash = function(command) {
                        this.bindKey(command.bindKey, command);
                    }, this.parseKeys = function(keys) {
                        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(x) {
                            return x;
                        }), key = parts.pop(), keyCode = keyUtil[key];
                        if (keyUtil.FUNCTION_KEYS[keyCode]) key = keyUtil.FUNCTION_KEYS[keyCode].toLowerCase();
                        else if (!parts.length) return {
                            key: key,
                            hashId: -1
                        };
                        else if (1 == parts.length && "shift" == parts[0]) return {
                            key: key.toUpperCase(),
                            hashId: -1
                        };
                        for(var hashId = 0, i = parts.length; i--;){
                            var modifier = keyUtil.KEY_MODS[parts[i]];
                            if (null == modifier) return "undefined" != typeof console && console.error("invalid modifier " + parts[i] + " in " + keys), !1;
                            hashId |= modifier;
                        }
                        return {
                            key: key,
                            hashId: hashId
                        };
                    }, this.findKeyCommand = function(hashId, keyString) {
                        var key = KEY_MODS[hashId] + keyString;
                        return this.commandKeyBinding[key];
                    }, this.handleKeyboard = function(data, hashId, keyString, keyCode) {
                        if (!(keyCode < 0)) {
                            var key = KEY_MODS[hashId] + keyString, command = this.commandKeyBinding[key];
                            return (data.$keyChain && (data.$keyChain += " " + key, command = this.commandKeyBinding[data.$keyChain] || command), command && ("chainKeys" == command || "chainKeys" == command[command.length - 1])) ? (data.$keyChain = data.$keyChain || key, {
                                command: "null"
                            }) : (data.$keyChain && (hashId && 4 != hashId || 1 != keyString.length ? (-1 == hashId || keyCode > 0) && (data.$keyChain = "") : data.$keyChain = data.$keyChain.slice(0, -key.length - 1)), {
                                command: command
                            });
                        }
                    }, this.getStatusText = function(editor, data) {
                        return data.$keyChain || "";
                    };
                }).call(HashHandler.prototype), exports.HashHandler = HashHandler, exports.MultiHashHandler = MultiHashHandler;
            }), ace.define("ace/commands/command_manager", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/keyboard/hash_handler",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("../lib/oop"), MultiHashHandler = require("../keyboard/hash_handler").MultiHashHandler, EventEmitter = require("../lib/event_emitter").EventEmitter, CommandManager = function(platform, commands) {
                    MultiHashHandler.call(this, commands, platform), this.byName = this.commands, this.setDefaultHandler("exec", function(e) {
                        return e.command.exec(e.editor, e.args || {});
                    });
                };
                oop.inherits(CommandManager, MultiHashHandler), (function() {
                    oop.implement(this, EventEmitter), this.exec = function(command, editor, args) {
                        if (Array.isArray(command)) {
                            for(var i = command.length; i--;)if (this.exec(command[i], editor, args)) return !0;
                            return !1;
                        }
                        if ("string" == typeof command && (command = this.commands[command]), !command || editor && editor.$readOnly && !command.readOnly || !1 != this.$checkCommandState && command.isAvailable && !command.isAvailable(editor)) return !1;
                        var e = {
                            editor: editor,
                            command: command,
                            args: args
                        };
                        return e.returnValue = this._emit("exec", e), this._signal("afterExec", e), !1 !== e.returnValue;
                    }, this.toggleRecording = function(editor) {
                        if (!this.$inReplay) return (editor && editor._emit("changeStatus"), this.recording) ? (this.macro.pop(), this.off("exec", this.$addCommandToMacro), this.macro.length || (this.macro = this.oldMacro), this.recording = !1) : (this.$addCommandToMacro || (this.$addCommandToMacro = (function(e) {
                            this.macro.push([
                                e.command,
                                e.args
                            ]);
                        }).bind(this)), this.oldMacro = this.macro, this.macro = [], this.on("exec", this.$addCommandToMacro), this.recording = !0);
                    }, this.replay = function(editor) {
                        if (!this.$inReplay && this.macro) {
                            if (this.recording) return this.toggleRecording(editor);
                            try {
                                this.$inReplay = !0, this.macro.forEach(function(x) {
                                    "string" == typeof x ? this.exec(x, editor) : this.exec(x[0], editor, x[1]);
                                }, this);
                            } finally{
                                this.$inReplay = !1;
                            }
                        }
                    }, this.trimMacro = function(m) {
                        return m.map(function(x) {
                            return "string" != typeof x[0] && (x[0] = x[0].name), x[1] || (x = x[0]), x;
                        });
                    };
                }).call(CommandManager.prototype), exports.CommandManager = CommandManager;
            }), ace.define("ace/commands/default_commands", [
                "require",
                "exports",
                "module",
                "ace/lib/lang",
                "ace/config",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var lang = require("../lib/lang"), config = require("../config"), Range = require("../range").Range;
                function bindKey(win, mac) {
                    return {
                        win: win,
                        mac: mac
                    };
                }
                exports.commands = [
                    {
                        name: "showSettingsMenu",
                        description: "Show settings menu",
                        bindKey: bindKey("Ctrl-,", "Command-,"),
                        exec: function(editor) {
                            config.loadModule("ace/ext/settings_menu", function(module) {
                                module.init(editor), editor.showSettingsMenu();
                            });
                        },
                        readOnly: !0
                    },
                    {
                        name: "goToNextError",
                        description: "Go to next error",
                        bindKey: bindKey("Alt-E", "F4"),
                        exec: function(editor) {
                            config.loadModule("./ext/error_marker", function(module) {
                                module.showErrorMarker(editor, 1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: !0
                    },
                    {
                        name: "goToPreviousError",
                        description: "Go to previous error",
                        bindKey: bindKey("Alt-Shift-E", "Shift-F4"),
                        exec: function(editor) {
                            config.loadModule("./ext/error_marker", function(module) {
                                module.showErrorMarker(editor, -1);
                            });
                        },
                        scrollIntoView: "animate",
                        readOnly: !0
                    },
                    {
                        name: "selectall",
                        description: "Select all",
                        bindKey: bindKey("Ctrl-A", "Command-A"),
                        exec: function(editor) {
                            editor.selectAll();
                        },
                        readOnly: !0
                    },
                    {
                        name: "centerselection",
                        description: "Center selection",
                        bindKey: bindKey(null, "Ctrl-L"),
                        exec: function(editor) {
                            editor.centerSelection();
                        },
                        readOnly: !0
                    },
                    {
                        name: "gotoline",
                        description: "Go to line...",
                        bindKey: bindKey("Ctrl-L", "Command-L"),
                        exec: function(editor, line) {
                            "number" != typeof line || isNaN(line) || editor.gotoLine(line), editor.prompt({
                                $type: "gotoLine"
                            });
                        },
                        readOnly: !0
                    },
                    {
                        name: "fold",
                        bindKey: bindKey("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
                        exec: function(editor) {
                            editor.session.toggleFold(!1);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "unfold",
                        bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
                        exec: function(editor) {
                            editor.session.toggleFold(!0);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "toggleFoldWidget",
                        description: "Toggle fold widget",
                        bindKey: bindKey("F2", "F2"),
                        exec: function(editor) {
                            editor.session.toggleFoldWidget();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "toggleParentFoldWidget",
                        description: "Toggle parent fold widget",
                        bindKey: bindKey("Alt-F2", "Alt-F2"),
                        exec: function(editor) {
                            editor.session.toggleFoldWidget(!0);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "foldall",
                        description: "Fold all",
                        bindKey: bindKey(null, "Ctrl-Command-Option-0"),
                        exec: function(editor) {
                            editor.session.foldAll();
                        },
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "foldAllComments",
                        description: "Fold all comments",
                        bindKey: bindKey(null, "Ctrl-Command-Option-0"),
                        exec: function(editor) {
                            editor.session.foldAllComments();
                        },
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "foldOther",
                        description: "Fold other",
                        bindKey: bindKey("Alt-0", "Command-Option-0"),
                        exec: function(editor) {
                            editor.session.foldAll(), editor.session.unfold(editor.selection.getAllRanges());
                        },
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "unfoldall",
                        description: "Unfold all",
                        bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
                        exec: function(editor) {
                            editor.session.unfold();
                        },
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "findnext",
                        description: "Find next",
                        bindKey: bindKey("Ctrl-K", "Command-G"),
                        exec: function(editor) {
                            editor.findNext();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "findprevious",
                        description: "Find previous",
                        bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
                        exec: function(editor) {
                            editor.findPrevious();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "center",
                        readOnly: !0
                    },
                    {
                        name: "selectOrFindNext",
                        description: "Select or find next",
                        bindKey: bindKey("Alt-K", "Ctrl-G"),
                        exec: function(editor) {
                            editor.selection.isEmpty() ? editor.selection.selectWord() : editor.findNext();
                        },
                        readOnly: !0
                    },
                    {
                        name: "selectOrFindPrevious",
                        description: "Select or find previous",
                        bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
                        exec: function(editor) {
                            editor.selection.isEmpty() ? editor.selection.selectWord() : editor.findPrevious();
                        },
                        readOnly: !0
                    },
                    {
                        name: "find",
                        description: "Find",
                        bindKey: bindKey("Ctrl-F", "Command-F"),
                        exec: function(editor) {
                            config.loadModule("ace/ext/searchbox", function(e) {
                                e.Search(editor);
                            });
                        },
                        readOnly: !0
                    },
                    {
                        name: "overwrite",
                        description: "Overwrite",
                        bindKey: "Insert",
                        exec: function(editor) {
                            editor.toggleOverwrite();
                        },
                        readOnly: !0
                    },
                    {
                        name: "selecttostart",
                        description: "Select to start",
                        bindKey: bindKey("Ctrl-Shift-Home", "Command-Shift-Home|Command-Shift-Up"),
                        exec: function(editor) {
                            editor.getSelection().selectFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: !0,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotostart",
                        description: "Go to start",
                        bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
                        exec: function(editor) {
                            editor.navigateFileStart();
                        },
                        multiSelectAction: "forEach",
                        readOnly: !0,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectup",
                        description: "Select up",
                        bindKey: bindKey("Shift-Up", "Shift-Up|Ctrl-Shift-P"),
                        exec: function(editor) {
                            editor.getSelection().selectUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "golineup",
                        description: "Go line up",
                        bindKey: bindKey("Up", "Up|Ctrl-P"),
                        exec: function(editor, args) {
                            editor.navigateUp(args.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selecttoend",
                        description: "Select to end",
                        bindKey: bindKey("Ctrl-Shift-End", "Command-Shift-End|Command-Shift-Down"),
                        exec: function(editor) {
                            editor.getSelection().selectFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: !0,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "gotoend",
                        description: "Go to end",
                        bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
                        exec: function(editor) {
                            editor.navigateFileEnd();
                        },
                        multiSelectAction: "forEach",
                        readOnly: !0,
                        scrollIntoView: "animate",
                        aceCommandGroup: "fileJump"
                    },
                    {
                        name: "selectdown",
                        description: "Select down",
                        bindKey: bindKey("Shift-Down", "Shift-Down|Ctrl-Shift-N"),
                        exec: function(editor) {
                            editor.getSelection().selectDown();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "golinedown",
                        description: "Go line down",
                        bindKey: bindKey("Down", "Down|Ctrl-N"),
                        exec: function(editor, args) {
                            editor.navigateDown(args.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectwordleft",
                        description: "Select word left",
                        bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
                        exec: function(editor) {
                            editor.getSelection().selectWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotowordleft",
                        description: "Go to word left",
                        bindKey: bindKey("Ctrl-Left", "Option-Left"),
                        exec: function(editor) {
                            editor.navigateWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selecttolinestart",
                        description: "Select to line start",
                        bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left|Ctrl-Shift-A"),
                        exec: function(editor) {
                            editor.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotolinestart",
                        description: "Go to line start",
                        bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
                        exec: function(editor) {
                            editor.navigateLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectleft",
                        description: "Select left",
                        bindKey: bindKey("Shift-Left", "Shift-Left|Ctrl-Shift-B"),
                        exec: function(editor) {
                            editor.getSelection().selectLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotoleft",
                        description: "Go to left",
                        bindKey: bindKey("Left", "Left|Ctrl-B"),
                        exec: function(editor, args) {
                            editor.navigateLeft(args.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectwordright",
                        description: "Select word right",
                        bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
                        exec: function(editor) {
                            editor.getSelection().selectWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotowordright",
                        description: "Go to word right",
                        bindKey: bindKey("Ctrl-Right", "Option-Right"),
                        exec: function(editor) {
                            editor.navigateWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selecttolineend",
                        description: "Select to line end",
                        bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right|Shift-End|Ctrl-Shift-E"),
                        exec: function(editor) {
                            editor.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotolineend",
                        description: "Go to line end",
                        bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
                        exec: function(editor) {
                            editor.navigateLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectright",
                        description: "Select right",
                        bindKey: bindKey("Shift-Right", "Shift-Right"),
                        exec: function(editor) {
                            editor.getSelection().selectRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "gotoright",
                        description: "Go to right",
                        bindKey: bindKey("Right", "Right|Ctrl-F"),
                        exec: function(editor, args) {
                            editor.navigateRight(args.times);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectpagedown",
                        description: "Select page down",
                        bindKey: "Shift-PageDown",
                        exec: function(editor) {
                            editor.selectPageDown();
                        },
                        readOnly: !0
                    },
                    {
                        name: "pagedown",
                        description: "Page down",
                        bindKey: bindKey(null, "Option-PageDown"),
                        exec: function(editor) {
                            editor.scrollPageDown();
                        },
                        readOnly: !0
                    },
                    {
                        name: "gotopagedown",
                        description: "Go to page down",
                        bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
                        exec: function(editor) {
                            editor.gotoPageDown();
                        },
                        readOnly: !0
                    },
                    {
                        name: "selectpageup",
                        description: "Select page up",
                        bindKey: "Shift-PageUp",
                        exec: function(editor) {
                            editor.selectPageUp();
                        },
                        readOnly: !0
                    },
                    {
                        name: "pageup",
                        description: "Page up",
                        bindKey: bindKey(null, "Option-PageUp"),
                        exec: function(editor) {
                            editor.scrollPageUp();
                        },
                        readOnly: !0
                    },
                    {
                        name: "gotopageup",
                        description: "Go to page up",
                        bindKey: "PageUp",
                        exec: function(editor) {
                            editor.gotoPageUp();
                        },
                        readOnly: !0
                    },
                    {
                        name: "scrollup",
                        description: "Scroll up",
                        bindKey: bindKey("Ctrl-Up", null),
                        exec: function(e) {
                            e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight);
                        },
                        readOnly: !0
                    },
                    {
                        name: "scrolldown",
                        description: "Scroll down",
                        bindKey: bindKey("Ctrl-Down", null),
                        exec: function(e) {
                            e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight);
                        },
                        readOnly: !0
                    },
                    {
                        name: "selectlinestart",
                        description: "Select line start",
                        bindKey: "Shift-Home",
                        exec: function(editor) {
                            editor.getSelection().selectLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectlineend",
                        description: "Select line end",
                        bindKey: "Shift-End",
                        exec: function(editor) {
                            editor.getSelection().selectLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "togglerecording",
                        description: "Toggle recording",
                        bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
                        exec: function(editor) {
                            editor.commands.toggleRecording(editor);
                        },
                        readOnly: !0
                    },
                    {
                        name: "replaymacro",
                        description: "Replay macro",
                        bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
                        exec: function(editor) {
                            editor.commands.replay(editor);
                        },
                        readOnly: !0
                    },
                    {
                        name: "jumptomatching",
                        description: "Jump to matching",
                        bindKey: bindKey("Ctrl-\\|Ctrl-P", "Command-\\"),
                        exec: function(editor) {
                            editor.jumpToMatching();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: !0
                    },
                    {
                        name: "selecttomatching",
                        description: "Select to matching",
                        bindKey: bindKey("Ctrl-Shift-\\|Ctrl-Shift-P", "Command-Shift-\\"),
                        exec: function(editor) {
                            editor.jumpToMatching(!0);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: !0
                    },
                    {
                        name: "expandToMatching",
                        description: "Expand to matching",
                        bindKey: bindKey("Ctrl-Shift-M", "Ctrl-Shift-M"),
                        exec: function(editor) {
                            editor.jumpToMatching(!0, !0);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "animate",
                        readOnly: !0
                    },
                    {
                        name: "passKeysToBrowser",
                        description: "Pass keys to browser",
                        bindKey: bindKey(null, null),
                        exec: function() {},
                        passEvent: !0,
                        readOnly: !0
                    },
                    {
                        name: "copy",
                        description: "Copy",
                        exec: function(editor) {},
                        readOnly: !0
                    },
                    {
                        name: "cut",
                        description: "Cut",
                        exec: function(editor) {
                            var range = editor.$copyWithEmptySelection && editor.selection.isEmpty() ? editor.selection.getLineRange() : editor.selection.getRange();
                            editor._emit("cut", range), range.isEmpty() || editor.session.remove(range), editor.clearSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "paste",
                        description: "Paste",
                        exec: function(editor, args) {
                            editor.$handlePaste(args);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removeline",
                        description: "Remove line",
                        bindKey: bindKey("Ctrl-D", "Command-D"),
                        exec: function(editor) {
                            editor.removeLines();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "duplicateSelection",
                        description: "Duplicate selection",
                        bindKey: bindKey("Ctrl-Shift-D", "Command-Shift-D"),
                        exec: function(editor) {
                            editor.duplicateSelection();
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "sortlines",
                        description: "Sort lines",
                        bindKey: bindKey("Ctrl-Alt-S", "Command-Alt-S"),
                        exec: function(editor) {
                            editor.sortLines();
                        },
                        scrollIntoView: "selection",
                        multiSelectAction: "forEachLine"
                    },
                    {
                        name: "togglecomment",
                        description: "Toggle comment",
                        bindKey: bindKey("Ctrl-/", "Command-/"),
                        exec: function(editor) {
                            editor.toggleCommentLines();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "toggleBlockComment",
                        description: "Toggle block comment",
                        bindKey: bindKey("Ctrl-Shift-/", "Command-Shift-/"),
                        exec: function(editor) {
                            editor.toggleBlockComment();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "modifyNumberUp",
                        description: "Modify number up",
                        bindKey: bindKey("Ctrl-Shift-Up", "Alt-Shift-Up"),
                        exec: function(editor) {
                            editor.modifyNumber(1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "modifyNumberDown",
                        description: "Modify number down",
                        bindKey: bindKey("Ctrl-Shift-Down", "Alt-Shift-Down"),
                        exec: function(editor) {
                            editor.modifyNumber(-1);
                        },
                        scrollIntoView: "cursor",
                        multiSelectAction: "forEach"
                    },
                    {
                        name: "replace",
                        description: "Replace",
                        bindKey: bindKey("Ctrl-H", "Command-Option-F"),
                        exec: function(editor) {
                            config.loadModule("ace/ext/searchbox", function(e) {
                                e.Search(editor, !0);
                            });
                        }
                    },
                    {
                        name: "undo",
                        description: "Undo",
                        bindKey: bindKey("Ctrl-Z", "Command-Z"),
                        exec: function(editor) {
                            editor.undo();
                        }
                    },
                    {
                        name: "redo",
                        description: "Redo",
                        bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
                        exec: function(editor) {
                            editor.redo();
                        }
                    },
                    {
                        name: "copylinesup",
                        description: "Copy lines up",
                        bindKey: bindKey("Alt-Shift-Up", "Command-Option-Up"),
                        exec: function(editor) {
                            editor.copyLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesup",
                        description: "Move lines up",
                        bindKey: bindKey("Alt-Up", "Option-Up"),
                        exec: function(editor) {
                            editor.moveLinesUp();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "copylinesdown",
                        description: "Copy lines down",
                        bindKey: bindKey("Alt-Shift-Down", "Command-Option-Down"),
                        exec: function(editor) {
                            editor.copyLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "movelinesdown",
                        description: "Move lines down",
                        bindKey: bindKey("Alt-Down", "Option-Down"),
                        exec: function(editor) {
                            editor.moveLinesDown();
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "del",
                        description: "Delete",
                        bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
                        exec: function(editor) {
                            editor.remove("right");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "backspace",
                        description: "Backspace",
                        bindKey: bindKey("Shift-Backspace|Backspace", "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),
                        exec: function(editor) {
                            editor.remove("left");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "cut_or_delete",
                        description: "Cut or delete",
                        bindKey: bindKey("Shift-Delete", null),
                        exec: function(editor) {
                            if (!editor.selection.isEmpty()) return !1;
                            editor.remove("left");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestart",
                        description: "Remove to line start",
                        bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
                        exec: function(editor) {
                            editor.removeToLineStart();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineend",
                        description: "Remove to line end",
                        bindKey: bindKey("Alt-Delete", "Ctrl-K|Command-Delete"),
                        exec: function(editor) {
                            editor.removeToLineEnd();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolinestarthard",
                        description: "Remove to line start hard",
                        bindKey: bindKey("Ctrl-Shift-Backspace", null),
                        exec: function(editor) {
                            var range = editor.selection.getRange();
                            range.start.column = 0, editor.session.remove(range);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removetolineendhard",
                        description: "Remove to line end hard",
                        bindKey: bindKey("Ctrl-Shift-Delete", null),
                        exec: function(editor) {
                            var range = editor.selection.getRange();
                            range.end.column = Number.MAX_VALUE, editor.session.remove(range);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordleft",
                        description: "Remove word left",
                        bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
                        exec: function(editor) {
                            editor.removeWordLeft();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "removewordright",
                        description: "Remove word right",
                        bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
                        exec: function(editor) {
                            editor.removeWordRight();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "outdent",
                        description: "Outdent",
                        bindKey: bindKey("Shift-Tab", "Shift-Tab"),
                        exec: function(editor) {
                            editor.blockOutdent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "indent",
                        description: "Indent",
                        bindKey: bindKey("Tab", "Tab"),
                        exec: function(editor) {
                            editor.indent();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockoutdent",
                        description: "Block outdent",
                        bindKey: bindKey("Ctrl-[", "Ctrl-["),
                        exec: function(editor) {
                            editor.blockOutdent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "blockindent",
                        description: "Block indent",
                        bindKey: bindKey("Ctrl-]", "Ctrl-]"),
                        exec: function(editor) {
                            editor.blockIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "selectionPart"
                    },
                    {
                        name: "insertstring",
                        description: "Insert string",
                        exec: function(editor, str) {
                            editor.insert(str);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "inserttext",
                        description: "Insert text",
                        exec: function(editor, args) {
                            editor.insert(lang.stringRepeat(args.text || "", args.times || 1));
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "splitline",
                        description: "Split line",
                        bindKey: bindKey(null, "Ctrl-O"),
                        exec: function(editor) {
                            editor.splitLine();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "transposeletters",
                        description: "Transpose letters",
                        bindKey: bindKey("Alt-Shift-X", "Ctrl-T"),
                        exec: function(editor) {
                            editor.transposeLetters();
                        },
                        multiSelectAction: function(editor) {
                            editor.transposeSelections(1);
                        },
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "touppercase",
                        description: "To uppercase",
                        bindKey: bindKey("Ctrl-U", "Ctrl-U"),
                        exec: function(editor) {
                            editor.toUpperCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "tolowercase",
                        description: "To lowercase",
                        bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
                        exec: function(editor) {
                            editor.toLowerCase();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "autoindent",
                        description: "Auto Indent",
                        bindKey: bindKey(null, null),
                        exec: function(editor) {
                            editor.autoIndent();
                        },
                        multiSelectAction: "forEachLine",
                        scrollIntoView: "animate"
                    },
                    {
                        name: "expandtoline",
                        description: "Expand to line",
                        bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
                        exec: function(editor) {
                            var range = editor.selection.getRange();
                            range.start.column = range.end.column = 0, range.end.row++, editor.selection.setRange(range, !1);
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "joinlines",
                        description: "Join lines",
                        bindKey: bindKey(null, null),
                        exec: function(editor) {
                            for(var isBackwards = editor.selection.isBackwards(), selectionStart = isBackwards ? editor.selection.getSelectionLead() : editor.selection.getSelectionAnchor(), selectionEnd = isBackwards ? editor.selection.getSelectionAnchor() : editor.selection.getSelectionLead(), firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length, selectedCount = editor.session.doc.getTextRange(editor.selection.getRange()).replace(/\n\s*/, " ").length, insertLine = editor.session.doc.getLine(selectionStart.row), i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++){
                                var curLine = lang.stringTrimLeft(lang.stringTrimRight(editor.session.doc.getLine(i)));
                                0 !== curLine.length && (curLine = " " + curLine), insertLine += curLine;
                            }
                            selectionEnd.row + 1 < editor.session.doc.getLength() - 1 && (insertLine += editor.session.doc.getNewLineCharacter()), editor.clearSelection(), editor.session.doc.replace(new Range(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine), selectedCount > 0 ? (editor.selection.moveCursorTo(selectionStart.row, selectionStart.column), editor.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount)) : (firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? firstLineEndCol + 1 : firstLineEndCol, editor.selection.moveCursorTo(selectionStart.row, firstLineEndCol));
                        },
                        multiSelectAction: "forEach",
                        readOnly: !0
                    },
                    {
                        name: "invertSelection",
                        description: "Invert selection",
                        bindKey: bindKey(null, null),
                        exec: function(editor) {
                            var endRow = editor.session.doc.getLength() - 1, endCol = editor.session.doc.getLine(endRow).length, ranges = editor.selection.rangeList.ranges, newRanges = [];
                            ranges.length < 1 && (ranges = [
                                editor.selection.getRange()
                            ]);
                            for(var i = 0; i < ranges.length; i++)i != ranges.length - 1 || ranges[i].end.row === endRow && ranges[i].end.column === endCol || newRanges.push(new Range(ranges[i].end.row, ranges[i].end.column, endRow, endCol)), 0 === i ? 0 === ranges[i].start.row && 0 === ranges[i].start.column || newRanges.push(new Range(0, 0, ranges[i].start.row, ranges[i].start.column)) : newRanges.push(new Range(ranges[i - 1].end.row, ranges[i - 1].end.column, ranges[i].start.row, ranges[i].start.column));
                            editor.exitMultiSelectMode(), editor.clearSelection();
                            for(var i = 0; i < newRanges.length; i++)editor.selection.addRange(newRanges[i], !1);
                        },
                        readOnly: !0,
                        scrollIntoView: "none"
                    },
                    {
                        name: "addLineAfter",
                        description: "Add new line after the current line",
                        exec: function(editor) {
                            editor.selection.clearSelection(), editor.navigateLineEnd(), editor.insert("\n");
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "addLineBefore",
                        description: "Add new line before the current line",
                        exec: function(editor) {
                            editor.selection.clearSelection();
                            var cursor = editor.getCursorPosition();
                            editor.selection.moveTo(cursor.row - 1, Number.MAX_VALUE), editor.insert("\n"), 0 === cursor.row && editor.navigateUp();
                        },
                        multiSelectAction: "forEach",
                        scrollIntoView: "cursor"
                    },
                    {
                        name: "openCommandPallete",
                        description: "Open command pallete",
                        bindKey: bindKey("F1", "F1"),
                        exec: function(editor) {
                            editor.prompt({
                                $type: "commands"
                            });
                        },
                        readOnly: !0
                    },
                    {
                        name: "modeSelect",
                        description: "Change language mode...",
                        bindKey: bindKey(null, null),
                        exec: function(editor) {
                            editor.prompt({
                                $type: "modes"
                            });
                        },
                        readOnly: !0
                    }
                ];
                for(var i = 1; i < 9; i++)exports.commands.push({
                    name: "foldToLevel" + i,
                    description: "Fold To Level " + i,
                    level: i,
                    exec: function(editor) {
                        editor.session.foldToLevel(this.level);
                    },
                    scrollIntoView: "center",
                    readOnly: !0
                });
            }), ace.define("ace/editor", [
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
                "ace/clipboard"
            ], function(require, exports, module) {
                "use strict";
                require("./lib/fixoldbrowsers");
                var oop = require("./lib/oop"), dom = require("./lib/dom"), lang = require("./lib/lang"), useragent = require("./lib/useragent"), TextInput = require("./keyboard/textinput").TextInput, MouseHandler = require("./mouse/mouse_handler").MouseHandler, FoldHandler = require("./mouse/fold_handler").FoldHandler, KeyBinding = require("./keyboard/keybinding").KeyBinding, EditSession = require("./edit_session").EditSession, Search = require("./search").Search, Range = require("./range").Range, EventEmitter = require("./lib/event_emitter").EventEmitter, CommandManager = require("./commands/command_manager").CommandManager, defaultCommands = require("./commands/default_commands").commands, config = require("./config"), TokenIterator = require("./token_iterator").TokenIterator, clipboard = require("./clipboard"), Editor = function(renderer, session, options) {
                    this.$toDestroy = [];
                    var container = renderer.getContainerElement();
                    this.container = container, this.renderer = renderer, this.id = "editor" + ++Editor.$uid, this.commands = new CommandManager(useragent.isMac ? "mac" : "win", defaultCommands), "object" == typeof document && (this.textInput = new TextInput(renderer.getTextAreaContainer(), this), this.renderer.textarea = this.textInput.getElement(), this.$mouseHandler = new MouseHandler(this), new FoldHandler(this)), this.keyBinding = new KeyBinding(this), this.$search = new Search().set({
                        wrap: !0
                    }), this.$historyTracker = this.$historyTracker.bind(this), this.commands.on("exec", this.$historyTracker), this.$initOperationListeners(), this._$emitInputEvent = lang.delayedCall((function() {
                        this._signal("input", {}), this.session && this.session.bgTokenizer && this.session.bgTokenizer.scheduleStart();
                    }).bind(this)), this.on("change", function(_, _self) {
                        _self._$emitInputEvent.schedule(31);
                    }), this.setSession(session || options && options.session || new EditSession("")), config.resetOptions(this), options && this.setOptions(options), config._signal("editor", this);
                };
                Editor.$uid = 0, (function() {
                    oop.implement(this, EventEmitter), this.$initOperationListeners = function() {
                        this.commands.on("exec", this.startOperation.bind(this), !0), this.commands.on("afterExec", this.endOperation.bind(this), !0), this.$opResetTimer = lang.delayedCall(this.endOperation.bind(this, !0)), this.on("change", (function() {
                            this.curOp || (this.startOperation(), this.curOp.selectionBefore = this.$lastSel), this.curOp.docChanged = !0;
                        }).bind(this), !0), this.on("changeSelection", (function() {
                            this.curOp || (this.startOperation(), this.curOp.selectionBefore = this.$lastSel), this.curOp.selectionChanged = !0;
                        }).bind(this), !0);
                    }, this.curOp = null, this.prevOp = {}, this.startOperation = function(commandEvent) {
                        if (this.curOp) {
                            if (!commandEvent || this.curOp.command) return;
                            this.prevOp = this.curOp;
                        }
                        commandEvent || (this.previousCommand = null, commandEvent = {}), this.$opResetTimer.schedule(), this.curOp = this.session.curOp = {
                            command: commandEvent.command || {},
                            args: commandEvent.args,
                            scrollTop: this.renderer.scrollTop
                        }, this.curOp.selectionBefore = this.selection.toJSON();
                    }, this.endOperation = function(e) {
                        if (this.curOp && this.session) {
                            if (e && !1 === e.returnValue || !this.session) return this.curOp = null;
                            if ((!0 != e || !this.curOp.command || "mouse" != this.curOp.command.name) && (this._signal("beforeEndOperation"), this.curOp)) {
                                var command = this.curOp.command, scrollIntoView = command && command.scrollIntoView;
                                if (scrollIntoView) {
                                    switch(scrollIntoView){
                                        case "center-animate":
                                            scrollIntoView = "animate";
                                        case "center":
                                            this.renderer.scrollCursorIntoView(null, 0.5);
                                            break;
                                        case "animate":
                                        case "cursor":
                                            this.renderer.scrollCursorIntoView();
                                            break;
                                        case "selectionPart":
                                            var range = this.selection.getRange(), config = this.renderer.layerConfig;
                                            (range.start.row >= config.lastRow || range.end.row <= config.firstRow) && this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                                    }
                                    "animate" == scrollIntoView && this.renderer.animateScrolling(this.curOp.scrollTop);
                                }
                                var sel = this.selection.toJSON();
                                this.curOp.selectionAfter = sel, this.$lastSel = this.selection.toJSON(), this.session.getUndoManager().addSelection(sel), this.prevOp = this.curOp, this.curOp = null;
                            }
                        }
                    }, this.$mergeableCommands = [
                        "backspace",
                        "del",
                        "insertstring"
                    ], this.$historyTracker = function(e) {
                        if (this.$mergeUndoDeltas) {
                            var prev = this.prevOp, mergeableCommands = this.$mergeableCommands, shouldMerge = prev.command && e.command.name == prev.command.name;
                            if ("insertstring" == e.command.name) {
                                var text = e.args;
                                void 0 === this.mergeNextCommand && (this.mergeNextCommand = !0), shouldMerge = shouldMerge && this.mergeNextCommand && // previous command allows to coalesce with
                                (!/\s/.test(text) || /\s/.test(prev.args)), this.mergeNextCommand = !0;
                            } else shouldMerge = shouldMerge && -1 !== mergeableCommands.indexOf(e.command.name); // the command is mergeable
                            "always" != this.$mergeUndoDeltas && Date.now() - this.sequenceStartTime > 2000 && (shouldMerge = !1), shouldMerge ? this.session.mergeUndoDeltas = !0 : -1 !== mergeableCommands.indexOf(e.command.name) && (this.sequenceStartTime = Date.now());
                        }
                    }, this.setKeyboardHandler = function(keyboardHandler, cb) {
                        if (keyboardHandler && "string" == typeof keyboardHandler && "ace" != keyboardHandler) {
                            this.$keybindingId = keyboardHandler;
                            var _self = this;
                            config.loadModule([
                                "keybinding",
                                keyboardHandler
                            ], function(module) {
                                _self.$keybindingId == keyboardHandler && _self.keyBinding.setKeyboardHandler(module && module.handler), cb && cb();
                            });
                        } else this.$keybindingId = null, this.keyBinding.setKeyboardHandler(keyboardHandler), cb && cb();
                    }, this.getKeyboardHandler = function() {
                        return this.keyBinding.getKeyboardHandler();
                    }, this.setSession = function(session) {
                        if (this.session != session) {
                            this.curOp && this.endOperation(), this.curOp = {};
                            var oldSession = this.session;
                            if (oldSession) {
                                this.session.off("change", this.$onDocumentChange), this.session.off("changeMode", this.$onChangeMode), this.session.off("tokenizerUpdate", this.$onTokenizerUpdate), this.session.off("changeTabSize", this.$onChangeTabSize), this.session.off("changeWrapLimit", this.$onChangeWrapLimit), this.session.off("changeWrapMode", this.$onChangeWrapMode), this.session.off("changeFold", this.$onChangeFold), this.session.off("changeFrontMarker", this.$onChangeFrontMarker), this.session.off("changeBackMarker", this.$onChangeBackMarker), this.session.off("changeBreakpoint", this.$onChangeBreakpoint), this.session.off("changeAnnotation", this.$onChangeAnnotation), this.session.off("changeOverwrite", this.$onCursorChange), this.session.off("changeScrollTop", this.$onScrollTopChange), this.session.off("changeScrollLeft", this.$onScrollLeftChange);
                                var selection = this.session.getSelection();
                                selection.off("changeCursor", this.$onCursorChange), selection.off("changeSelection", this.$onSelectionChange);
                            }
                            this.session = session, session ? (this.$onDocumentChange = this.onDocumentChange.bind(this), session.on("change", this.$onDocumentChange), this.renderer.setSession(session), this.$onChangeMode = this.onChangeMode.bind(this), session.on("changeMode", this.$onChangeMode), this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this), session.on("tokenizerUpdate", this.$onTokenizerUpdate), this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer), session.on("changeTabSize", this.$onChangeTabSize), this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this), session.on("changeWrapLimit", this.$onChangeWrapLimit), this.$onChangeWrapMode = this.onChangeWrapMode.bind(this), session.on("changeWrapMode", this.$onChangeWrapMode), this.$onChangeFold = this.onChangeFold.bind(this), session.on("changeFold", this.$onChangeFold), this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this), this.session.on("changeFrontMarker", this.$onChangeFrontMarker), this.$onChangeBackMarker = this.onChangeBackMarker.bind(this), this.session.on("changeBackMarker", this.$onChangeBackMarker), this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this), this.session.on("changeBreakpoint", this.$onChangeBreakpoint), this.$onChangeAnnotation = this.onChangeAnnotation.bind(this), this.session.on("changeAnnotation", this.$onChangeAnnotation), this.$onCursorChange = this.onCursorChange.bind(this), this.session.on("changeOverwrite", this.$onCursorChange), this.$onScrollTopChange = this.onScrollTopChange.bind(this), this.session.on("changeScrollTop", this.$onScrollTopChange), this.$onScrollLeftChange = this.onScrollLeftChange.bind(this), this.session.on("changeScrollLeft", this.$onScrollLeftChange), this.selection = session.getSelection(), this.selection.on("changeCursor", this.$onCursorChange), this.$onSelectionChange = this.onSelectionChange.bind(this), this.selection.on("changeSelection", this.$onSelectionChange), this.onChangeMode(), this.onCursorChange(), this.onScrollTopChange(), this.onScrollLeftChange(), this.onSelectionChange(), this.onChangeFrontMarker(), this.onChangeBackMarker(), this.onChangeBreakpoint(), this.onChangeAnnotation(), this.session.getUseWrapMode() && this.renderer.adjustWrapLimit(), this.renderer.updateFull()) : (this.selection = null, this.renderer.setSession(session)), this._signal("changeSession", {
                                session: session,
                                oldSession: oldSession
                            }), this.curOp = null, oldSession && oldSession._signal("changeEditor", {
                                oldEditor: this
                            }), session && session._signal("changeEditor", {
                                editor: this
                            }), session && session.bgTokenizer && session.bgTokenizer.scheduleStart();
                        }
                    }, this.getSession = function() {
                        return this.session;
                    }, this.setValue = function(val, cursorPos) {
                        return this.session.doc.setValue(val), cursorPos ? 1 == cursorPos ? this.navigateFileEnd() : -1 == cursorPos && this.navigateFileStart() : this.selectAll(), val;
                    }, this.getValue = function() {
                        return this.session.getValue();
                    }, this.getSelection = function() {
                        return this.selection;
                    }, this.resize = function(force) {
                        this.renderer.onResize(force);
                    }, this.setTheme = function(theme, cb) {
                        this.renderer.setTheme(theme, cb);
                    }, this.getTheme = function() {
                        return this.renderer.getTheme();
                    }, this.setStyle = function(style) {
                        this.renderer.setStyle(style);
                    }, this.unsetStyle = function(style) {
                        this.renderer.unsetStyle(style);
                    }, this.getFontSize = function() {
                        return this.getOption("fontSize") || dom.computedStyle(this.container).fontSize;
                    }, this.setFontSize = function(size) {
                        this.setOption("fontSize", size);
                    }, this.$highlightBrackets = function() {
                        if (!this.$highlightPending) {
                            var self1 = this;
                            this.$highlightPending = !0, setTimeout(function() {
                                self1.$highlightPending = !1;
                                var session = self1.session;
                                if (session && session.bgTokenizer) {
                                    session.$bracketHighlight && (session.$bracketHighlight.markerIds.forEach(function(id) {
                                        session.removeMarker(id);
                                    }), session.$bracketHighlight = null);
                                    var ranges = session.getMatchingBracketRanges(self1.getCursorPosition());
                                    if (!ranges && session.$mode.getMatching && (ranges = session.$mode.getMatching(self1.session)), ranges) {
                                        var markerType = "ace_bracket";
                                        Array.isArray(ranges) ? 1 == ranges.length && (markerType = "ace_error_bracket") : ranges = [
                                            ranges
                                        ], 2 == ranges.length && (0 == Range.comparePoints(ranges[0].end, ranges[1].start) ? ranges = [
                                            Range.fromPoints(ranges[0].start, ranges[1].end)
                                        ] : 0 == Range.comparePoints(ranges[0].start, ranges[1].end) && (ranges = [
                                            Range.fromPoints(ranges[1].start, ranges[0].end)
                                        ])), session.$bracketHighlight = {
                                            ranges: ranges,
                                            markerIds: ranges.map(function(range) {
                                                return session.addMarker(range, markerType, "text");
                                            })
                                        };
                                    }
                                }
                            }, 50);
                        }
                    }, this.$highlightTags = function() {
                        if (!this.$highlightTagPending) {
                            var self1 = this;
                            this.$highlightTagPending = !0, setTimeout(function() {
                                self1.$highlightTagPending = !1;
                                var session = self1.session;
                                if (session && session.bgTokenizer) {
                                    var pos = self1.getCursorPosition(), iterator = new TokenIterator(self1.session, pos.row, pos.column), token = iterator.getCurrentToken();
                                    if (!token || !/\b(?:tag-open|tag-name)/.test(token.type)) {
                                        session.removeMarker(session.$tagHighlight), session.$tagHighlight = null;
                                        return;
                                    }
                                    if (-1 !== token.type.indexOf("tag-open") && !(token = iterator.stepForward())) return;
                                    var tag = token.value, currentTag = token.value, depth = 0, prevToken = iterator.stepBackward();
                                    if ("<" === prevToken.value) do prevToken = token, (token = iterator.stepForward()) && (-1 !== token.type.indexOf("tag-name") ? tag === (currentTag = token.value) && ("<" === prevToken.value ? depth++ : "</" === prevToken.value && depth--) : tag === currentTag && "/>" === token.value && // self closing tag
                                    depth--);
                                    while (token && depth >= 0)
                                    else {
                                        do if (token = prevToken, prevToken = iterator.stepBackward(), token) {
                                            if (-1 !== token.type.indexOf("tag-name")) tag === token.value && ("<" === prevToken.value ? depth++ : "</" === prevToken.value && depth--);
                                            else if ("/>" === token.value) {
                                                for(// self closing tag
                                                var stepCount = 0, tmpToken = prevToken; tmpToken;){
                                                    if (-1 !== tmpToken.type.indexOf("tag-name") && tmpToken.value === tag) {
                                                        depth--;
                                                        break;
                                                    }
                                                    if ("<" === tmpToken.value) break;
                                                    tmpToken = iterator.stepBackward(), stepCount++;
                                                }
                                                for(var i = 0; i < stepCount; i++)iterator.stepForward();
                                            }
                                        }
                                        while (prevToken && depth <= 0)
                                        iterator.stepForward();
                                    }
                                    if (!token) {
                                        session.removeMarker(session.$tagHighlight), session.$tagHighlight = null;
                                        return;
                                    }
                                    var row = iterator.getCurrentTokenRow(), column = iterator.getCurrentTokenColumn(), range = new Range(row, column, row, column + token.value.length), sbm = session.$backMarkers[session.$tagHighlight];
                                    session.$tagHighlight && void 0 != sbm && 0 !== range.compareRange(sbm.range) && (session.removeMarker(session.$tagHighlight), session.$tagHighlight = null), session.$tagHighlight || (session.$tagHighlight = session.addMarker(range, "ace_bracket", "text"));
                                }
                            }, 50);
                        }
                    }, this.focus = function() {
                        var _self = this;
                        setTimeout(function() {
                            _self.isFocused() || _self.textInput.focus();
                        }), this.textInput.focus();
                    }, this.isFocused = function() {
                        return this.textInput.isFocused();
                    }, this.blur = function() {
                        this.textInput.blur();
                    }, this.onFocus = function(e) {
                        this.$isFocused || (this.$isFocused = !0, this.renderer.showCursor(), this.renderer.visualizeFocus(), this._emit("focus", e));
                    }, this.onBlur = function(e) {
                        this.$isFocused && (this.$isFocused = !1, this.renderer.hideCursor(), this.renderer.visualizeBlur(), this._emit("blur", e));
                    }, this.$cursorChange = function() {
                        this.renderer.updateCursor(), this.$highlightBrackets(), this.$highlightTags(), this.$updateHighlightActiveLine();
                    }, this.onDocumentChange = function(delta) {
                        var wrap = this.session.$useWrapMode, lastRow = delta.start.row == delta.end.row ? delta.end.row : 1 / 0;
                        this.renderer.updateLines(delta.start.row, lastRow, wrap), this._signal("change", delta), this.$cursorChange();
                    }, this.onTokenizerUpdate = function(e) {
                        var rows = e.data;
                        this.renderer.updateLines(rows.first, rows.last);
                    }, this.onScrollTopChange = function() {
                        this.renderer.scrollToY(this.session.getScrollTop());
                    }, this.onScrollLeftChange = function() {
                        this.renderer.scrollToX(this.session.getScrollLeft());
                    }, this.onCursorChange = function() {
                        this.$cursorChange(), this._signal("changeSelection");
                    }, this.$updateHighlightActiveLine = function() {
                        var highlight, session = this.getSession();
                        if (this.$highlightActiveLine && ("line" == this.$selectionStyle && this.selection.isMultiLine() || (highlight = this.getCursorPosition()), this.renderer.theme && this.renderer.theme.$selectionColorConflict && !this.selection.isEmpty() && (highlight = !1), this.renderer.$maxLines && 1 === this.session.getLength() && !(this.renderer.$minLines > 1) && (highlight = !1)), session.$highlightLineMarker && !highlight) session.removeMarker(session.$highlightLineMarker.id), session.$highlightLineMarker = null;
                        else if (!session.$highlightLineMarker && highlight) {
                            var range = new Range(highlight.row, highlight.column, highlight.row, 1 / 0);
                            range.id = session.addMarker(range, "ace_active-line", "screenLine"), session.$highlightLineMarker = range;
                        } else highlight && (session.$highlightLineMarker.start.row = highlight.row, session.$highlightLineMarker.end.row = highlight.row, session.$highlightLineMarker.start.column = highlight.column, session._signal("changeBackMarker"));
                    }, this.onSelectionChange = function(e) {
                        var session = this.session;
                        if (session.$selectionMarker && session.removeMarker(session.$selectionMarker), session.$selectionMarker = null, this.selection.isEmpty()) this.$updateHighlightActiveLine();
                        else {
                            var range = this.selection.getRange(), style = this.getSelectionStyle();
                            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
                        }
                        var re = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
                        this.session.highlight(re), this._signal("changeSelection");
                    }, this.$getSelectionHighLightRegexp = function() {
                        var session = this.session, selection = this.getSelectionRange();
                        if (!(selection.isEmpty() || selection.isMultiLine())) {
                            var startColumn = selection.start.column, endColumn = selection.end.column, line = session.getLine(selection.start.row), needle = line.substring(startColumn, endColumn);
                            if (!(needle.length > 5000) && /[\w\d]/.test(needle)) {
                                var re = this.$search.$assembleRegExp({
                                    wholeWord: !0,
                                    caseSensitive: !0,
                                    needle: needle
                                }), wordWithBoundary = line.substring(startColumn - 1, endColumn + 1);
                                if (re.test(wordWithBoundary)) return re;
                            }
                        }
                    }, this.onChangeFrontMarker = function() {
                        this.renderer.updateFrontMarkers();
                    }, this.onChangeBackMarker = function() {
                        this.renderer.updateBackMarkers();
                    }, this.onChangeBreakpoint = function() {
                        this.renderer.updateBreakpoints();
                    }, this.onChangeAnnotation = function() {
                        this.renderer.setAnnotations(this.session.getAnnotations());
                    }, this.onChangeMode = function(e) {
                        this.renderer.updateText(), this._emit("changeMode", e);
                    }, this.onChangeWrapLimit = function() {
                        this.renderer.updateFull();
                    }, this.onChangeWrapMode = function() {
                        this.renderer.onResize(!0);
                    }, this.onChangeFold = function() {
                        this.$updateHighlightActiveLine(), this.renderer.updateFull();
                    }, this.getSelectedText = function() {
                        return this.session.getTextRange(this.getSelectionRange());
                    }, this.getCopyText = function() {
                        var text = this.getSelectedText(), nl = this.session.doc.getNewLineCharacter(), copyLine = !1;
                        if (!text && this.$copyWithEmptySelection) {
                            copyLine = !0;
                            for(var ranges = this.selection.getAllRanges(), i = 0; i < ranges.length; i++){
                                var range = ranges[i];
                                i && ranges[i - 1].start.row == range.start.row || (text += this.session.getLine(range.start.row) + nl);
                            }
                        }
                        var e = {
                            text: text
                        };
                        return this._signal("copy", e), clipboard.lineMode = !!copyLine && e.text, e.text;
                    }, this.onCopy = function() {
                        this.commands.exec("copy", this);
                    }, this.onCut = function() {
                        this.commands.exec("cut", this);
                    }, this.onPaste = function(text, event) {
                        this.commands.exec("paste", this, {
                            text: text,
                            event: event
                        });
                    }, this.$handlePaste = function(e) {
                        "string" == typeof e && (e = {
                            text: e
                        }), this._signal("paste", e);
                        var text = e.text, lineMode = text === clipboard.lineMode, session = this.session;
                        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) lineMode ? session.insert({
                            row: this.selection.lead.row,
                            column: 0
                        }, text) : this.insert(text);
                        else if (lineMode) this.selection.rangeList.ranges.forEach(function(range) {
                            session.insert({
                                row: range.start.row,
                                column: 0
                            }, text);
                        });
                        else {
                            var lines = text.split(/\r\n|\r|\n/), ranges = this.selection.rangeList.ranges, isFullLine = 2 == lines.length && (!lines[0] || !lines[1]);
                            if (lines.length != ranges.length || isFullLine) return this.commands.exec("insertstring", this, text);
                            for(var i = ranges.length; i--;){
                                var range = ranges[i];
                                range.isEmpty() || session.remove(range), session.insert(range.start, lines[i]);
                            }
                        }
                    }, this.execCommand = function(command, args) {
                        return this.commands.exec(command, this, args);
                    }, this.insert = function(text, pasted) {
                        var session = this.session, mode = session.getMode(), cursor = this.getCursorPosition();
                        if (this.getBehavioursEnabled() && !pasted) {
                            var transform = mode.transformAction(session.getState(cursor.row), "insertion", this, session, text);
                            transform && (text === transform.text || this.inVirtualSelectionMode || (this.session.mergeUndoDeltas = !1, this.mergeNextCommand = !1), text = transform.text);
                        }
                        if ("\t" == text && (text = this.session.getTabString()), this.selection.isEmpty()) {
                            if (this.session.getOverwrite() && -1 == text.indexOf("\n")) {
                                var range = new Range.fromPoints(cursor, cursor);
                                range.end.column += text.length, this.session.remove(range);
                            }
                        } else {
                            var range = this.getSelectionRange();
                            cursor = this.session.remove(range), this.clearSelection();
                        }
                        if ("\n" == text || "\r\n" == text) {
                            var line = session.getLine(cursor.row);
                            if (cursor.column > line.search(/\S|$/)) {
                                var d = line.substr(cursor.column).search(/\S|$/);
                                session.doc.removeInLine(cursor.row, cursor.column, cursor.column + d);
                            }
                        }
                        this.clearSelection();
                        var start = cursor.column, lineState = session.getState(cursor.row), line = session.getLine(cursor.row), shouldOutdent = mode.checkOutdent(lineState, line, text);
                        if (session.insert(cursor, text), transform && transform.selection && (2 == transform.selection.length ? // Transform relative to the current column
                        this.selection.setSelectionRange(new Range(cursor.row, start + transform.selection[0], cursor.row, start + transform.selection[1])) : // Transform relative to the current row.
                        this.selection.setSelectionRange(new Range(cursor.row + transform.selection[0], transform.selection[1], cursor.row + transform.selection[2], transform.selection[3]))), this.$enableAutoIndent) {
                            if (session.getDocument().isNewLine(text)) {
                                var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
                                session.insert({
                                    row: cursor.row + 1,
                                    column: 0
                                }, lineIndent);
                            }
                            shouldOutdent && mode.autoOutdent(lineState, session, cursor.row);
                        }
                    }, this.autoIndent = function() {
                        var startRow, endRow, line, currIndent, range, session = this.session, mode = session.getMode();
                        if (this.selection.isEmpty()) startRow = 0, endRow = session.doc.getLength() - 1;
                        else {
                            var selectedRange = this.getSelectionRange();
                            startRow = selectedRange.start.row, endRow = selectedRange.end.row;
                        }
                        for(var prevLineState = "", prevLine = "", lineIndent = "", tab = session.getTabString(), row = startRow; row <= endRow; row++)row > 0 && (prevLineState = session.getState(row - 1), prevLine = session.getLine(row - 1), lineIndent = mode.getNextLineIndent(prevLineState, prevLine, tab)), line = session.getLine(row), lineIndent !== (currIndent = mode.$getIndent(line)) && (currIndent.length > 0 && (range = new Range(row, 0, row, currIndent.length), session.remove(range)), lineIndent.length > 0 && session.insert({
                            row: row,
                            column: 0
                        }, lineIndent)), mode.autoOutdent(prevLineState, session, row);
                    }, this.onTextInput = function(text, composition) {
                        if (!composition) return this.keyBinding.onTextInput(text);
                        this.startOperation({
                            command: {
                                name: "insertstring"
                            }
                        });
                        var applyComposition = this.applyComposition.bind(this, text, composition);
                        this.selection.rangeCount ? this.forEachSelection(applyComposition) : applyComposition(), this.endOperation();
                    }, this.applyComposition = function(text, composition) {
                        if (composition.extendLeft || composition.extendRight) {
                            var r = this.selection.getRange();
                            r.start.column -= composition.extendLeft, r.end.column += composition.extendRight, r.start.column < 0 && (r.start.row--, r.start.column += this.session.getLine(r.start.row).length + 1), this.selection.setRange(r), text || r.isEmpty() || this.remove();
                        }
                        if ((text || !this.selection.isEmpty()) && this.insert(text, !0), composition.restoreStart || composition.restoreEnd) {
                            var r = this.selection.getRange();
                            r.start.column -= composition.restoreStart, r.end.column -= composition.restoreEnd, this.selection.setRange(r);
                        }
                    }, this.onCommandKey = function(e, hashId, keyCode) {
                        return this.keyBinding.onCommandKey(e, hashId, keyCode);
                    }, this.setOverwrite = function(overwrite) {
                        this.session.setOverwrite(overwrite);
                    }, this.getOverwrite = function() {
                        return this.session.getOverwrite();
                    }, this.toggleOverwrite = function() {
                        this.session.toggleOverwrite();
                    }, this.setScrollSpeed = function(speed) {
                        this.setOption("scrollSpeed", speed);
                    }, this.getScrollSpeed = function() {
                        return this.getOption("scrollSpeed");
                    }, this.setDragDelay = function(dragDelay) {
                        this.setOption("dragDelay", dragDelay);
                    }, this.getDragDelay = function() {
                        return this.getOption("dragDelay");
                    }, this.setSelectionStyle = function(val) {
                        this.setOption("selectionStyle", val);
                    }, this.getSelectionStyle = function() {
                        return this.getOption("selectionStyle");
                    }, this.setHighlightActiveLine = function(shouldHighlight) {
                        this.setOption("highlightActiveLine", shouldHighlight);
                    }, this.getHighlightActiveLine = function() {
                        return this.getOption("highlightActiveLine");
                    }, this.setHighlightGutterLine = function(shouldHighlight) {
                        this.setOption("highlightGutterLine", shouldHighlight);
                    }, this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    }, this.setHighlightSelectedWord = function(shouldHighlight) {
                        this.setOption("highlightSelectedWord", shouldHighlight);
                    }, this.getHighlightSelectedWord = function() {
                        return this.$highlightSelectedWord;
                    }, this.setAnimatedScroll = function(shouldAnimate) {
                        this.renderer.setAnimatedScroll(shouldAnimate);
                    }, this.getAnimatedScroll = function() {
                        return this.renderer.getAnimatedScroll();
                    }, this.setShowInvisibles = function(showInvisibles) {
                        this.renderer.setShowInvisibles(showInvisibles);
                    }, this.getShowInvisibles = function() {
                        return this.renderer.getShowInvisibles();
                    }, this.setDisplayIndentGuides = function(display) {
                        this.renderer.setDisplayIndentGuides(display);
                    }, this.getDisplayIndentGuides = function() {
                        return this.renderer.getDisplayIndentGuides();
                    }, this.setShowPrintMargin = function(showPrintMargin) {
                        this.renderer.setShowPrintMargin(showPrintMargin);
                    }, this.getShowPrintMargin = function() {
                        return this.renderer.getShowPrintMargin();
                    }, this.setPrintMarginColumn = function(showPrintMargin) {
                        this.renderer.setPrintMarginColumn(showPrintMargin);
                    }, this.getPrintMarginColumn = function() {
                        return this.renderer.getPrintMarginColumn();
                    }, this.setReadOnly = function(readOnly) {
                        this.setOption("readOnly", readOnly);
                    }, this.getReadOnly = function() {
                        return this.getOption("readOnly");
                    }, this.setBehavioursEnabled = function(enabled) {
                        this.setOption("behavioursEnabled", enabled);
                    }, this.getBehavioursEnabled = function() {
                        return this.getOption("behavioursEnabled");
                    }, this.setWrapBehavioursEnabled = function(enabled) {
                        this.setOption("wrapBehavioursEnabled", enabled);
                    }, this.getWrapBehavioursEnabled = function() {
                        return this.getOption("wrapBehavioursEnabled");
                    }, this.setShowFoldWidgets = function(show) {
                        this.setOption("showFoldWidgets", show);
                    }, this.getShowFoldWidgets = function() {
                        return this.getOption("showFoldWidgets");
                    }, this.setFadeFoldWidgets = function(fade) {
                        this.setOption("fadeFoldWidgets", fade);
                    }, this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    }, this.remove = function(dir) {
                        this.selection.isEmpty() && ("left" == dir ? this.selection.selectLeft() : this.selection.selectRight());
                        var range = this.getSelectionRange();
                        if (this.getBehavioursEnabled()) {
                            var session = this.session, state = session.getState(range.start.row), new_range = session.getMode().transformAction(state, "deletion", this, session, range);
                            if (0 === range.end.column) {
                                var text = session.getTextRange(range);
                                if ("\n" == text[text.length - 1]) {
                                    var line = session.getLine(range.end.row);
                                    /^\s+$/.test(line) && (range.end.column = line.length);
                                }
                            }
                            new_range && (range = new_range);
                        }
                        this.session.remove(range), this.clearSelection();
                    }, this.removeWordRight = function() {
                        this.selection.isEmpty() && this.selection.selectWordRight(), this.session.remove(this.getSelectionRange()), this.clearSelection();
                    }, this.removeWordLeft = function() {
                        this.selection.isEmpty() && this.selection.selectWordLeft(), this.session.remove(this.getSelectionRange()), this.clearSelection();
                    }, this.removeToLineStart = function() {
                        this.selection.isEmpty() && this.selection.selectLineStart(), this.selection.isEmpty() && this.selection.selectLeft(), this.session.remove(this.getSelectionRange()), this.clearSelection();
                    }, this.removeToLineEnd = function() {
                        this.selection.isEmpty() && this.selection.selectLineEnd();
                        var range = this.getSelectionRange();
                        range.start.column == range.end.column && range.start.row == range.end.row && (range.end.column = 0, range.end.row++), this.session.remove(range), this.clearSelection();
                    }, this.splitLine = function() {
                        this.selection.isEmpty() || (this.session.remove(this.getSelectionRange()), this.clearSelection());
                        var cursor = this.getCursorPosition();
                        this.insert("\n"), this.moveCursorToPosition(cursor);
                    }, this.transposeLetters = function() {
                        if (this.selection.isEmpty()) {
                            var swap, range, cursor = this.getCursorPosition(), column = cursor.column;
                            if (0 !== column) {
                                var line = this.session.getLine(cursor.row);
                                column < line.length ? (swap = line.charAt(column) + line.charAt(column - 1), range = new Range(cursor.row, column - 1, cursor.row, column + 1)) : (swap = line.charAt(column - 1) + line.charAt(column - 2), range = new Range(cursor.row, column - 2, cursor.row, column)), this.session.replace(range, swap), this.session.selection.moveToPosition(range.end);
                            }
                        }
                    }, this.toLowerCase = function() {
                        var originalRange = this.getSelectionRange();
                        this.selection.isEmpty() && this.selection.selectWord();
                        var range = this.getSelectionRange(), text = this.session.getTextRange(range);
                        this.session.replace(range, text.toLowerCase()), this.selection.setSelectionRange(originalRange);
                    }, this.toUpperCase = function() {
                        var originalRange = this.getSelectionRange();
                        this.selection.isEmpty() && this.selection.selectWord();
                        var range = this.getSelectionRange(), text = this.session.getTextRange(range);
                        this.session.replace(range, text.toUpperCase()), this.selection.setSelectionRange(originalRange);
                    }, this.indent = function() {
                        var session = this.session, range = this.getSelectionRange();
                        if (range.start.row < range.end.row) {
                            var rows = this.$getSelectedRows();
                            session.indentRows(rows.first, rows.last, "\t");
                            return;
                        }
                        if (range.start.column < range.end.column) {
                            var text = session.getTextRange(range);
                            if (!/^\s+$/.test(text)) {
                                var rows = this.$getSelectedRows();
                                session.indentRows(rows.first, rows.last, "\t");
                                return;
                            }
                        }
                        var line = session.getLine(range.start.row), position = range.start, size = session.getTabSize(), column = session.documentToScreenColumn(position.row, position.column);
                        if (this.session.getUseSoftTabs()) var count = size - column % size, indentString = lang.stringRepeat(" ", count);
                        else {
                            for(var count = column % size; " " == line[range.start.column - 1] && count;)range.start.column--, count--;
                            this.selection.setSelectionRange(range), indentString = "\t";
                        }
                        return this.insert(indentString);
                    }, this.blockIndent = function() {
                        var rows = this.$getSelectedRows();
                        this.session.indentRows(rows.first, rows.last, "\t");
                    }, this.blockOutdent = function() {
                        var selection = this.session.getSelection();
                        this.session.outdentRows(selection.getRange());
                    }, this.sortLines = function() {
                        for(var rows = this.$getSelectedRows(), session = this.session, lines = [], i = rows.first; i <= rows.last; i++)lines.push(session.getLine(i));
                        lines.sort(function(a, b) {
                            return a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
                        });
                        for(var deleteRange = new Range(0, 0, 0, 0), i = rows.first; i <= rows.last; i++){
                            var line = session.getLine(i);
                            deleteRange.start.row = i, deleteRange.end.row = i, deleteRange.end.column = line.length, session.replace(deleteRange, lines[i - rows.first]);
                        }
                    }, this.toggleCommentLines = function() {
                        var state = this.session.getState(this.getCursorPosition().row), rows = this.$getSelectedRows();
                        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
                    }, this.toggleBlockComment = function() {
                        var cursor = this.getCursorPosition(), state = this.session.getState(cursor.row), range = this.getSelectionRange();
                        this.session.getMode().toggleBlockComment(state, this.session, range, cursor);
                    }, this.getNumberAt = function(row, column) {
                        var _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
                        _numberRx.lastIndex = 0;
                        for(var s = this.session.getLine(row); _numberRx.lastIndex < column;){
                            var m = _numberRx.exec(s);
                            if (m.index <= column && m.index + m[0].length >= column) return {
                                value: m[0],
                                start: m.index,
                                end: m.index + m[0].length
                            };
                        }
                        return null;
                    }, this.modifyNumber = function(amount) {
                        var row = this.selection.getCursor().row, column = this.selection.getCursor().column, charRange = new Range(row, column - 1, row, column), c = this.session.getTextRange(charRange);
                        if (!isNaN(parseFloat(c)) && isFinite(c)) {
                            var nr = this.getNumberAt(row, column);
                            if (nr) {
                                var fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end, decimals = nr.start + nr.value.length - fp, t = parseFloat(nr.value);
                                t *= Math.pow(10, decimals), fp !== nr.end && column < fp ? amount *= Math.pow(10, nr.end - column - 1) : amount *= Math.pow(10, nr.end - column), t += amount;
                                var nnr = (t /= Math.pow(10, decimals)).toFixed(decimals), replaceRange = new Range(row, nr.start, row, nr.end);
                                this.session.replace(replaceRange, nnr), this.moveCursorTo(row, Math.max(nr.start + 1, column + nnr.length - nr.value.length));
                            }
                        } else this.toggleWord();
                    }, this.$toggleWordPairs = [
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
                        ]
                    ], this.toggleWord = function() {
                        var reg, row = this.selection.getCursor().row, column = this.selection.getCursor().column;
                        this.selection.selectWord();
                        var currentState = this.getSelectedText(), currWordStart = this.selection.getWordRange().start.column, wordParts = currentState.replace(/([a-z]+|[A-Z]+)(?=[A-Z_]|$)/g, "$1 ").split(/\s/), delta = column - currWordStart - 1;
                        delta < 0 && (delta = 0);
                        var curLength = 0, itLength = 0, that = this;
                        currentState.match(/[A-Za-z0-9_]+/) && wordParts.forEach(function(item, i) {
                            itLength = curLength + item.length, delta >= curLength && delta <= itLength && (currentState = item, that.selection.clearSelection(), that.moveCursorTo(row, curLength + currWordStart), that.selection.selectTo(row, itLength + currWordStart)), curLength = itLength;
                        });
                        for(var wordPairs = this.$toggleWordPairs, i = 0; i < wordPairs.length; i++)for(var item = wordPairs[i], j = 0; j <= 1; j++){
                            var negate = +!j, firstCondition = currentState.match(RegExp("^\\s?_?(" + lang.escapeRegExp(item[j]) + ")\\s?$", "i"));
                            firstCondition && currentState.match(RegExp("([_]|^|\\s)(" + lang.escapeRegExp(firstCondition[1]) + ")($|\\s)", "g")) && (reg = currentState.replace(RegExp(lang.escapeRegExp(item[j]), "i"), function(result) {
                                var res = item[negate];
                                return result.toUpperCase() == result ? res = res.toUpperCase() : result.charAt(0).toUpperCase() == result.charAt(0) && (res = res.substr(0, 0) + item[negate].charAt(0).toUpperCase() + res.substr(1)), res;
                            }), this.insert(reg), reg = "");
                        }
                    }, this.removeLines = function() {
                        var rows = this.$getSelectedRows();
                        this.session.removeFullLines(rows.first, rows.last), this.clearSelection();
                    }, this.duplicateSelection = function() {
                        var sel = this.selection, doc = this.session, range = sel.getRange(), reverse = sel.isBackwards();
                        if (range.isEmpty()) {
                            var row = range.start.row;
                            doc.duplicateLines(row, row);
                        } else {
                            var point = reverse ? range.start : range.end, endPoint = doc.insert(point, doc.getTextRange(range), !1);
                            range.start = point, range.end = endPoint, sel.setSelectionRange(range, reverse);
                        }
                    }, this.moveLinesDown = function() {
                        this.$moveLines(1, !1);
                    }, this.moveLinesUp = function() {
                        this.$moveLines(-1, !1);
                    }, this.moveText = function(range, toPosition, copy) {
                        return this.session.moveText(range, toPosition, copy);
                    }, this.copyLinesUp = function() {
                        this.$moveLines(-1, !0);
                    }, this.copyLinesDown = function() {
                        this.$moveLines(1, !0);
                    }, this.$moveLines = function(dir, copy) {
                        var rows, moved, selection = this.selection;
                        if (!selection.inMultiSelectMode || this.inVirtualSelectionMode) {
                            var range = selection.toOrientedRange();
                            rows = this.$getSelectedRows(range), moved = this.session.$moveLines(rows.first, rows.last, copy ? 0 : dir), copy && -1 == dir && (moved = 0), range.moveBy(moved, 0), selection.fromOrientedRange(range);
                        } else {
                            var ranges = selection.rangeList.ranges;
                            selection.rangeList.detach(this.session), this.inVirtualSelectionMode = !0;
                            for(var diff = 0, totalDiff = 0, l = ranges.length, i = 0; i < l; i++){
                                var rangeIndex = i;
                                ranges[i].moveBy(diff, 0);
                                for(var first = (rows = this.$getSelectedRows(ranges[i])).first, last = rows.last; ++i < l;){
                                    totalDiff && ranges[i].moveBy(totalDiff, 0);
                                    var subRows = this.$getSelectedRows(ranges[i]);
                                    if (copy && subRows.first != last || !copy && subRows.first > last + 1) break;
                                    last = subRows.last;
                                }
                                for(i--, diff = this.session.$moveLines(first, last, copy ? 0 : dir), copy && -1 == dir && (rangeIndex = i + 1); rangeIndex <= i;)ranges[rangeIndex].moveBy(diff, 0), rangeIndex++;
                                copy || (diff = 0), totalDiff += diff;
                            }
                            selection.fromOrientedRange(selection.ranges[0]), selection.rangeList.attach(this.session), this.inVirtualSelectionMode = !1;
                        }
                    }, this.$getSelectedRows = function(range) {
                        return range = (range || this.getSelectionRange()).collapseRows(), {
                            first: this.session.getRowFoldStart(range.start.row),
                            last: this.session.getRowFoldEnd(range.end.row)
                        };
                    }, this.onCompositionStart = function(compositionState) {
                        this.renderer.showComposition(compositionState);
                    }, this.onCompositionUpdate = function(text) {
                        this.renderer.setCompositionText(text);
                    }, this.onCompositionEnd = function() {
                        this.renderer.hideComposition();
                    }, this.getFirstVisibleRow = function() {
                        return this.renderer.getFirstVisibleRow();
                    }, this.getLastVisibleRow = function() {
                        return this.renderer.getLastVisibleRow();
                    }, this.isRowVisible = function(row) {
                        return row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow();
                    }, this.isRowFullyVisible = function(row) {
                        return row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow();
                    }, this.$getVisibleRowCount = function() {
                        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
                    }, this.$moveByPage = function(dir, select) {
                        var renderer = this.renderer, config = this.renderer.layerConfig, rows = dir * Math.floor(config.height / config.lineHeight);
                        !0 === select ? this.selection.$moveSelection(function() {
                            this.moveCursorBy(rows, 0);
                        }) : !1 === select && (this.selection.moveCursorBy(rows, 0), this.selection.clearSelection());
                        var scrollTop = renderer.scrollTop;
                        renderer.scrollBy(0, rows * config.lineHeight), null != select && renderer.scrollCursorIntoView(null, 0.5), renderer.animateScrolling(scrollTop);
                    }, this.selectPageDown = function() {
                        this.$moveByPage(1, !0);
                    }, this.selectPageUp = function() {
                        this.$moveByPage(-1, !0);
                    }, this.gotoPageDown = function() {
                        this.$moveByPage(1, !1);
                    }, this.gotoPageUp = function() {
                        this.$moveByPage(-1, !1);
                    }, this.scrollPageDown = function() {
                        this.$moveByPage(1);
                    }, this.scrollPageUp = function() {
                        this.$moveByPage(-1);
                    }, this.scrollToRow = function(row) {
                        this.renderer.scrollToRow(row);
                    }, this.scrollToLine = function(line, center, animate, callback) {
                        this.renderer.scrollToLine(line, center, animate, callback);
                    }, this.centerSelection = function() {
                        var range = this.getSelectionRange(), pos = {
                            row: Math.floor(range.start.row + (range.end.row - range.start.row) / 2),
                            column: Math.floor(range.start.column + (range.end.column - range.start.column) / 2)
                        };
                        this.renderer.alignCursor(pos, 0.5);
                    }, this.getCursorPosition = function() {
                        return this.selection.getCursor();
                    }, this.getCursorPositionScreen = function() {
                        return this.session.documentToScreenPosition(this.getCursorPosition());
                    }, this.getSelectionRange = function() {
                        return this.selection.getRange();
                    }, this.selectAll = function() {
                        this.selection.selectAll();
                    }, this.clearSelection = function() {
                        this.selection.clearSelection();
                    }, this.moveCursorTo = function(row, column) {
                        this.selection.moveCursorTo(row, column);
                    }, this.moveCursorToPosition = function(pos) {
                        this.selection.moveCursorToPosition(pos);
                    }, this.jumpToMatching = function(select, expand) {
                        var matchType, bracketType, range, pos, cursor = this.getCursorPosition(), iterator = new TokenIterator(this.session, cursor.row, cursor.column), prevToken = iterator.getCurrentToken(), token = prevToken || iterator.stepForward();
                        if (token) {
                            var found = !1, depth = {}, i = cursor.column - token.start, brackets = {
                                ")": "(",
                                "(": "(",
                                "]": "[",
                                "[": "[",
                                "{": "{",
                                "}": "{"
                            };
                            do {
                                if (token.value.match(/[{}()\[\]]/g)) {
                                    for(; i < token.value.length && !found; i++)if (brackets[token.value[i]]) switch(isNaN(depth[bracketType = brackets[token.value[i]] + "." + token.type.replace("rparen", "lparen")]) && (depth[bracketType] = 0), token.value[i]){
                                        case "(":
                                        case "[":
                                        case "{":
                                            depth[bracketType]++;
                                            break;
                                        case ")":
                                        case "]":
                                        case "}":
                                            depth[bracketType]--, -1 === depth[bracketType] && (matchType = "bracket", found = !0);
                                    }
                                } else -1 !== token.type.indexOf("tag-name") && (isNaN(depth[token.value]) && (depth[token.value] = 0), "<" === prevToken.value ? depth[token.value]++ : "</" === prevToken.value && depth[token.value]--, -1 === depth[token.value] && (matchType = "tag", found = !0));
                                found || (prevToken = token, token = iterator.stepForward(), i = 0);
                            }while (token && !found)
                            if (matchType) {
                                if ("bracket" === matchType) !(range = this.session.getBracketRange(cursor)) && (pos = (range = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1)).start, (expand || pos.row === cursor.row && 2 > Math.abs(pos.column - cursor.column)) && (range = this.session.getBracketRange(pos)));
                                else if ("tag" === matchType) {
                                    if (!token || -1 === token.type.indexOf("tag-name")) return;
                                    var tag = token.value;
                                    if (0 === (range = new Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2)).compare(cursor.row, cursor.column)) {
                                        found = !1;
                                        do token = prevToken, (prevToken = iterator.stepBackward()) && (-1 !== prevToken.type.indexOf("tag-close") && range.setEnd(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1), token.value === tag && -1 !== token.type.indexOf("tag-name") && ("<" === prevToken.value ? depth[tag]++ : "</" === prevToken.value && depth[tag]--, 0 === depth[tag] && (found = !0)));
                                        while (prevToken && !found)
                                    }
                                    token && token.type.indexOf("tag-name") && (pos = range.start).row == cursor.row && 2 > Math.abs(pos.column - cursor.column) && (pos = range.end);
                                }
                                (pos = range && range.cursor || pos) && (select ? range && expand ? this.selection.setRange(range) : range && range.isEqual(this.getSelectionRange()) ? this.clearSelection() : this.selection.selectTo(pos.row, pos.column) : this.selection.moveTo(pos.row, pos.column));
                            }
                        }
                    }, this.gotoLine = function(lineNumber, column, animate) {
                        this.selection.clearSelection(), this.session.unfold({
                            row: lineNumber - 1,
                            column: column || 0
                        }), this.exitMultiSelectMode && this.exitMultiSelectMode(), this.moveCursorTo(lineNumber - 1, column || 0), this.isRowFullyVisible(lineNumber - 1) || this.scrollToLine(lineNumber - 1, !0, animate);
                    }, this.navigateTo = function(row, column) {
                        this.selection.moveTo(row, column);
                    }, this.navigateUp = function(times) {
                        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
                            var selectionStart = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(selectionStart);
                        }
                        this.selection.clearSelection(), this.selection.moveCursorBy(-times || -1, 0);
                    }, this.navigateDown = function(times) {
                        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
                            var selectionEnd = this.selection.anchor.getPosition();
                            return this.moveCursorToPosition(selectionEnd);
                        }
                        this.selection.clearSelection(), this.selection.moveCursorBy(times || 1, 0);
                    }, this.navigateLeft = function(times) {
                        if (this.selection.isEmpty()) for(times = times || 1; times--;)this.selection.moveCursorLeft();
                        else {
                            var selectionStart = this.getSelectionRange().start;
                            this.moveCursorToPosition(selectionStart);
                        }
                        this.clearSelection();
                    }, this.navigateRight = function(times) {
                        if (this.selection.isEmpty()) for(times = times || 1; times--;)this.selection.moveCursorRight();
                        else {
                            var selectionEnd = this.getSelectionRange().end;
                            this.moveCursorToPosition(selectionEnd);
                        }
                        this.clearSelection();
                    }, this.navigateLineStart = function() {
                        this.selection.moveCursorLineStart(), this.clearSelection();
                    }, this.navigateLineEnd = function() {
                        this.selection.moveCursorLineEnd(), this.clearSelection();
                    }, this.navigateFileEnd = function() {
                        this.selection.moveCursorFileEnd(), this.clearSelection();
                    }, this.navigateFileStart = function() {
                        this.selection.moveCursorFileStart(), this.clearSelection();
                    }, this.navigateWordRight = function() {
                        this.selection.moveCursorWordRight(), this.clearSelection();
                    }, this.navigateWordLeft = function() {
                        this.selection.moveCursorWordLeft(), this.clearSelection();
                    }, this.replace = function(replacement, options) {
                        options && this.$search.set(options);
                        var range = this.$search.find(this.session), replaced = 0;
                        return range && (this.$tryReplace(range, replacement) && (replaced = 1), this.selection.setSelectionRange(range), this.renderer.scrollSelectionIntoView(range.start, range.end)), replaced;
                    }, this.replaceAll = function(replacement, options) {
                        options && this.$search.set(options);
                        var ranges = this.$search.findAll(this.session), replaced = 0;
                        if (!ranges.length) return replaced;
                        var selection = this.getSelectionRange();
                        this.selection.moveTo(0, 0);
                        for(var i = ranges.length - 1; i >= 0; --i)this.$tryReplace(ranges[i], replacement) && replaced++;
                        return this.selection.setSelectionRange(selection), replaced;
                    }, this.$tryReplace = function(range, replacement) {
                        var input = this.session.getTextRange(range);
                        return null !== (replacement = this.$search.replace(input, replacement)) ? (range.end = this.session.replace(range, replacement), range) : null;
                    }, this.getLastSearchOptions = function() {
                        return this.$search.getOptions();
                    }, this.find = function(needle, options, animate) {
                        options || (options = {}), "string" == typeof needle || needle instanceof RegExp ? options.needle = needle : "object" == typeof needle && oop.mixin(options, needle);
                        var range = this.selection.getRange();
                        null == options.needle && ((needle = this.session.getTextRange(range) || this.$search.$options.needle) || (range = this.session.getWordRange(range.start.row, range.start.column), needle = this.session.getTextRange(range)), this.$search.set({
                            needle: needle
                        })), this.$search.set(options), options.start || this.$search.set({
                            start: range
                        });
                        var newRange = this.$search.find(this.session);
                        return options.preventScroll ? newRange : newRange ? (this.revealRange(newRange, animate), newRange) : void (options.backwards ? range.start = range.end : range.end = range.start, this.selection.setRange(range));
                    }, this.findNext = function(options, animate) {
                        this.find({
                            skipCurrent: !0,
                            backwards: !1
                        }, options, animate);
                    }, this.findPrevious = function(options, animate) {
                        this.find(options, {
                            skipCurrent: !0,
                            backwards: !0
                        }, animate);
                    }, this.revealRange = function(range, animate) {
                        this.session.unfold(range), this.selection.setSelectionRange(range);
                        var scrollTop = this.renderer.scrollTop;
                        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5), !1 !== animate && this.renderer.animateScrolling(scrollTop);
                    }, this.undo = function() {
                        this.session.getUndoManager().undo(this.session), this.renderer.scrollCursorIntoView(null, 0.5);
                    }, this.redo = function() {
                        this.session.getUndoManager().redo(this.session), this.renderer.scrollCursorIntoView(null, 0.5);
                    }, this.destroy = function() {
                        this.$toDestroy && (this.$toDestroy.forEach(function(el) {
                            el.destroy();
                        }), this.$toDestroy = null), this.$mouseHandler && this.$mouseHandler.destroy(), this.renderer.destroy(), this._signal("destroy", this), this.session && this.session.destroy(), this._$emitInputEvent && this._$emitInputEvent.cancel(), this.removeAllListeners();
                    }, this.setAutoScrollEditorIntoView = function(enable) {
                        if (enable) {
                            var rect, self1 = this, shouldScroll = !1;
                            this.$scrollAnchor || (this.$scrollAnchor = document.createElement("div"));
                            var scrollAnchor = this.$scrollAnchor;
                            scrollAnchor.style.cssText = "position:absolute", this.container.insertBefore(scrollAnchor, this.container.firstChild);
                            var onChangeSelection = this.on("changeSelection", function() {
                                shouldScroll = !0;
                            }), onBeforeRender = this.renderer.on("beforeRender", function() {
                                shouldScroll && (rect = self1.renderer.container.getBoundingClientRect());
                            }), onAfterRender = this.renderer.on("afterRender", function() {
                                if (shouldScroll && rect && (self1.isFocused() || self1.searchBox && self1.searchBox.isFocused())) {
                                    var renderer = self1.renderer, pos = renderer.$cursorLayer.$pixelPos, config = renderer.layerConfig, top = pos.top - config.offset;
                                    null != (shouldScroll = pos.top >= 0 && top + rect.top < 0 || (!(pos.top < config.height) || !(pos.top + rect.top + config.lineHeight > window.innerHeight)) && null) && (scrollAnchor.style.top = top + "px", scrollAnchor.style.left = pos.left + "px", scrollAnchor.style.height = config.lineHeight + "px", scrollAnchor.scrollIntoView(shouldScroll)), shouldScroll = rect = null;
                                }
                            });
                            this.setAutoScrollEditorIntoView = function(enable) {
                                enable || (delete this.setAutoScrollEditorIntoView, this.off("changeSelection", onChangeSelection), this.renderer.off("afterRender", onAfterRender), this.renderer.off("beforeRender", onBeforeRender));
                            };
                        }
                    }, this.$resetCursorStyle = function() {
                        var style = this.$cursorStyle || "ace", cursorLayer = this.renderer.$cursorLayer;
                        cursorLayer && (cursorLayer.setSmoothBlinking(/smooth/.test(style)), cursorLayer.isBlinking = !this.$readOnly && "wide" != style, dom.setCssClass(cursorLayer.element, "ace_slim-cursors", /slim/.test(style)));
                    }, this.prompt = function(message, options, callback) {
                        var editor = this;
                        config.loadModule("./ext/prompt", function(module) {
                            module.prompt(editor, message, options, callback);
                        });
                    };
                }).call(Editor.prototype), config.defineOptions(Editor.prototype, "editor", {
                    selectionStyle: {
                        set: function(style) {
                            this.onSelectionChange(), this._signal("changeSelectionStyle", {
                                data: style
                            });
                        },
                        initialValue: "line"
                    },
                    highlightActiveLine: {
                        set: function() {
                            this.$updateHighlightActiveLine();
                        },
                        initialValue: !0
                    },
                    highlightSelectedWord: {
                        set: function(shouldHighlight) {
                            this.$onSelectionChange();
                        },
                        initialValue: !0
                    },
                    readOnly: {
                        set: function(readOnly) {
                            this.textInput.setReadOnly(readOnly), this.$resetCursorStyle();
                        },
                        initialValue: !1
                    },
                    copyWithEmptySelection: {
                        set: function(value) {
                            this.textInput.setCopyWithEmptySelection(value);
                        },
                        initialValue: !1
                    },
                    cursorStyle: {
                        set: function(val) {
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
                            !1,
                            !0,
                            "always"
                        ],
                        initialValue: !0
                    },
                    behavioursEnabled: {
                        initialValue: !0
                    },
                    wrapBehavioursEnabled: {
                        initialValue: !0
                    },
                    enableAutoIndent: {
                        initialValue: !0
                    },
                    autoScrollEditorIntoView: {
                        set: function(val) {
                            this.setAutoScrollEditorIntoView(val);
                        }
                    },
                    keyboardHandler: {
                        set: function(val) {
                            this.setKeyboardHandler(val);
                        },
                        get: function() {
                            return this.$keybindingId;
                        },
                        handlesSet: !0
                    },
                    value: {
                        set: function(val) {
                            this.session.setValue(val);
                        },
                        get: function() {
                            return this.getValue();
                        },
                        handlesSet: !0,
                        hidden: !0
                    },
                    session: {
                        set: function(val) {
                            this.setSession(val);
                        },
                        get: function() {
                            return this.session;
                        },
                        handlesSet: !0,
                        hidden: !0
                    },
                    showLineNumbers: {
                        set: function(show) {
                            this.renderer.$gutterLayer.setShowLineNumbers(show), this.renderer.$loop.schedule(this.renderer.CHANGE_GUTTER), show && this.$relativeLineNumbers ? relativeNumberRenderer.attach(this) : relativeNumberRenderer.detach(this);
                        },
                        initialValue: !0
                    },
                    relativeLineNumbers: {
                        set: function(value) {
                            this.$showLineNumbers && value ? relativeNumberRenderer.attach(this) : relativeNumberRenderer.detach(this);
                        }
                    },
                    placeholder: {
                        set: function(message) {
                            this.$updatePlaceholder || (this.$updatePlaceholder = (function() {
                                var value = this.session && (this.renderer.$composition || this.getValue());
                                if (value && this.renderer.placeholderNode) this.renderer.off("afterRender", this.$updatePlaceholder), dom.removeCssClass(this.container, "ace_hasPlaceholder"), this.renderer.placeholderNode.remove(), this.renderer.placeholderNode = null;
                                else if (value || this.renderer.placeholderNode) !value && this.renderer.placeholderNode && (this.renderer.placeholderNode.textContent = this.$placeholder || "");
                                else {
                                    this.renderer.on("afterRender", this.$updatePlaceholder), dom.addCssClass(this.container, "ace_hasPlaceholder");
                                    var el = dom.createElement("div");
                                    el.className = "ace_placeholder", el.textContent = this.$placeholder || "", this.renderer.placeholderNode = el, this.renderer.content.appendChild(this.renderer.placeholderNode);
                                }
                            }).bind(this), this.on("input", this.$updatePlaceholder)), this.$updatePlaceholder();
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
                var relativeNumberRenderer = {
                    getText: function(session, row) {
                        return (Math.abs(session.selection.lead.row - row) || row + 1 + (row < 9 ? "\xb7" : "")) + "";
                    },
                    getWidth: function(session, lastLineNumber, config) {
                        return Math.max(lastLineNumber.toString().length, (config.lastRow + 1).toString().length, 2) * config.characterWidth;
                    },
                    update: function(e, editor) {
                        editor.renderer.$loop.schedule(editor.renderer.CHANGE_GUTTER);
                    },
                    attach: function(editor) {
                        editor.renderer.$gutterLayer.$renderer = this, editor.on("changeSelection", this.update), this.update(null, editor);
                    },
                    detach: function(editor) {
                        editor.renderer.$gutterLayer.$renderer == this && (editor.renderer.$gutterLayer.$renderer = null), editor.off("changeSelection", this.update), this.update(null, editor);
                    }
                };
                exports.Editor = Editor;
            }), ace.define("ace/undomanager", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var UndoManager = function() {
                    this.$maxRev = 0, this.$fromUndo = !1, this.reset();
                };
                (function() {
                    this.addSession = function(session) {
                        this.$session = session;
                    }, this.add = function(delta, allowMerge, session) {
                        this.$fromUndo || delta == this.$lastDelta || (this.$keepRedoStack || (this.$redoStack.length = 0), !1 !== allowMerge && this.lastDeltas || (this.lastDeltas = [], this.$undoStack.push(this.lastDeltas), delta.id = this.$rev = ++this.$maxRev), ("remove" == delta.action || "insert" == delta.action) && (this.$lastDelta = delta), this.lastDeltas.push(delta));
                    }, this.addSelection = function(selection, rev) {
                        this.selections.push({
                            value: selection,
                            rev: rev || this.$rev
                        });
                    }, this.startNewGroup = function() {
                        return this.lastDeltas = null, this.$rev;
                    }, this.markIgnored = function(from, to) {
                        null == to && (to = this.$rev + 1);
                        for(var stack = this.$undoStack, i = stack.length; i--;){
                            var delta = stack[i][0];
                            if (delta.id <= from) break;
                            delta.id < to && (delta.ignore = !0);
                        }
                        this.lastDeltas = null;
                    }, this.getSelection = function(rev, after) {
                        for(var stack = this.selections, i = stack.length; i--;){
                            var selection = stack[i];
                            if (selection.rev < rev) return after && (selection = stack[i + 1]), selection;
                        }
                    }, this.getRevision = function() {
                        return this.$rev;
                    }, this.getDeltas = function(from, to) {
                        null == to && (to = this.$rev + 1);
                        for(var stack = this.$undoStack, end = null, start = 0, i = stack.length; i--;){
                            var delta = stack[i][0];
                            if (delta.id < to && !end && (end = i + 1), delta.id <= from) {
                                start = i + 1;
                                break;
                            }
                        }
                        return stack.slice(start, end);
                    }, this.getChangedRanges = function(from, to) {
                        null == to && (to = this.$rev + 1);
                    }, this.getChangedLines = function(from, to) {
                        null == to && (to = this.$rev + 1);
                    }, this.undo = function(session, dontSelect) {
                        this.lastDeltas = null;
                        var stack = this.$undoStack;
                        if (function(stack, pos) {
                            for(var i = pos; i--;){
                                var deltaSet = stack[i];
                                if (deltaSet && !deltaSet[0].ignore) {
                                    for(; i < pos - 1;){
                                        var swapped = function(ds1, ds2) {
                                            for(var i = ds1.length; i--;)for(var j = 0; j < ds2.length; j++)if (!swap(ds1[i], ds2[j])) {
                                                for(; i < ds1.length;){
                                                    for(; j--;)swap(ds2[j], ds1[i]);
                                                    j = ds2.length, i++;
                                                }
                                                return [
                                                    ds1,
                                                    ds2
                                                ];
                                            }
                                            return ds1.selectionBefore = ds2.selectionBefore = ds1.selectionAfter = ds2.selectionAfter = null, [
                                                ds2,
                                                ds1
                                            ];
                                        }(stack[i], stack[i + 1]);
                                        stack[i] = swapped[0], stack[i + 1] = swapped[1], i++;
                                    }
                                    return !0;
                                }
                            }
                        }(stack, stack.length)) {
                            session || (session = this.$session), this.$redoStackBaseRev !== this.$rev && this.$redoStack.length && (this.$redoStack = []), this.$fromUndo = !0;
                            var deltaSet = stack.pop(), undoSelectionRange = null;
                            return deltaSet && (undoSelectionRange = session.undoChanges(deltaSet, dontSelect), this.$redoStack.push(deltaSet), this.$syncRev()), this.$fromUndo = !1, undoSelectionRange;
                        }
                    }, this.redo = function(session, dontSelect) {
                        if (this.lastDeltas = null, session || (session = this.$session), this.$fromUndo = !0, this.$redoStackBaseRev != this.$rev) {
                            var diff = this.getDeltas(this.$redoStackBaseRev, this.$rev + 1);
                            (function(redoStack, deltaSets) {
                                for(var i = 0; i < deltaSets.length; i++)for(var deltas = deltaSets[i], j = 0; j < deltas.length; j++)!function(redoStack, d) {
                                    var d1;
                                    d = {
                                        start: clonePos((d1 = d).start),
                                        end: clonePos(d1.end),
                                        action: d1.action,
                                        lines: d1.lines.slice()
                                    };
                                    for(var j = redoStack.length; j--;){
                                        for(var deltaSet = redoStack[j], i = 0; i < deltaSet.length; i++){
                                            var xformed = function(d1, c1) {
                                                var before, after, i1 = "insert" == d1.action, i2 = "insert" == c1.action;
                                                if (i1 && i2) 0 > cmp(d1.start, c1.start) ? shift(c1, d1, 1) : shift(d1, c1, 1);
                                                else if (i1 && !i2) cmp(d1.start, c1.end) >= 0 ? shift(d1, c1, -1) : (0 >= cmp(d1.start, c1.start) || shift(d1, Range.fromPoints(c1.start, d1.start), -1), shift(c1, d1, 1));
                                                else if (!i1 && i2) cmp(c1.start, d1.end) >= 0 ? shift(c1, d1, -1) : (0 >= cmp(c1.start, d1.start) || shift(c1, Range.fromPoints(d1.start, c1.start), -1), shift(d1, c1, 1));
                                                else if (!i1 && !i2) {
                                                    if (cmp(c1.start, d1.end) >= 0) shift(c1, d1, -1);
                                                    else {
                                                        if (!(0 >= cmp(c1.end, d1.start))) return 0 > cmp(d1.start, c1.start) && (before = d1, d1 = splitDelta(d1, c1.start)), cmp(d1.end, c1.end) > 0 && (after = splitDelta(d1, c1.end)), shiftPos(c1.end, d1.start, d1.end, -1), after && !before && (d1.lines = after.lines, d1.start = after.start, d1.end = after.end, after = d1), [
                                                            c1,
                                                            before,
                                                            after
                                                        ].filter(Boolean);
                                                        shift(d1, c1, -1);
                                                    }
                                                }
                                                return [
                                                    c1,
                                                    d1
                                                ];
                                            }(deltaSet[i], d);
                                            d = xformed[0], 2 != xformed.length && (xformed[2] ? (deltaSet.splice(i + 1, 1, xformed[1], xformed[2]), i++) : !xformed[1] && (deltaSet.splice(i, 1), i--));
                                        }
                                        deltaSet.length || redoStack.splice(j, 1);
                                    }
                                }(redoStack, deltas[j]);
                            })(this.$redoStack, diff), this.$redoStackBaseRev = this.$rev, this.$redoStack.forEach(function(x) {
                                x[0].id = ++this.$maxRev;
                            }, this);
                        }
                        var deltaSet = this.$redoStack.pop(), redoSelectionRange = null;
                        return deltaSet && (redoSelectionRange = session.redoChanges(deltaSet, dontSelect), this.$undoStack.push(deltaSet), this.$syncRev()), this.$fromUndo = !1, redoSelectionRange;
                    }, this.$syncRev = function() {
                        var stack = this.$undoStack, nextDelta = stack[stack.length - 1], id = nextDelta && nextDelta[0].id || 0;
                        this.$redoStackBaseRev = id, this.$rev = id;
                    }, this.reset = function() {
                        this.lastDeltas = null, this.$lastDelta = null, this.$undoStack = [], this.$redoStack = [], this.$rev = 0, this.mark = 0, this.$redoStackBaseRev = this.$rev, this.selections = [];
                    }, this.canUndo = function() {
                        return this.$undoStack.length > 0;
                    }, this.canRedo = function() {
                        return this.$redoStack.length > 0;
                    }, this.bookmark = function(rev) {
                        void 0 == rev && (rev = this.$rev), this.mark = rev;
                    }, this.isAtBookmark = function() {
                        return this.$rev === this.mark;
                    }, this.toJSON = function() {}, this.fromJSON = function() {}, this.hasUndo = this.canUndo, this.hasRedo = this.canRedo, this.isClean = this.isAtBookmark, this.markClean = this.bookmark, this.$prettyPrint = function(delta) {
                        return delta ? stringifyDelta(delta) : stringifyDelta(this.$undoStack) + "\n---\n" + stringifyDelta(this.$redoStack);
                    };
                }).call(UndoManager.prototype);
                var Range = require("./range").Range, cmp = Range.comparePoints;
                function clonePos(pos) {
                    return {
                        row: pos.row,
                        column: pos.column
                    };
                }
                function stringifyDelta(d) {
                    if (Array.isArray(d = d || this)) return d.map(stringifyDelta).join("\n");
                    var type = "";
                    return d.action ? type = ("insert" == d.action ? "+" : "-") + "[" + d.lines + "]" : d.value && (type = Array.isArray(d.value) ? d.value.map(stringifyRange).join("\n") : stringifyRange(d.value)), d.start && (type += stringifyRange(d)), (d.id || d.rev) && (type += "\t(" + (d.id || d.rev) + ")"), type;
                }
                function stringifyRange(r) {
                    return r.start.row + ":" + r.start.column + "=>" + r.end.row + ":" + r.end.column;
                }
                function swap(d1, d2) {
                    var i1 = "insert" == d1.action, i2 = "insert" == d2.action;
                    if (i1 && i2) {
                        if (cmp(d2.start, d1.end) >= 0) shift(d2, d1, -1);
                        else {
                            if (!(0 >= cmp(d2.start, d1.start))) return null;
                            shift(d1, d2, 1);
                        }
                    } else if (i1 && !i2) {
                        if (cmp(d2.start, d1.end) >= 0) shift(d2, d1, -1);
                        else {
                            if (!(0 >= cmp(d2.end, d1.start))) return null;
                            shift(d1, d2, -1);
                        }
                    } else if (!i1 && i2) {
                        if (cmp(d2.start, d1.start) >= 0) shift(d2, d1, 1);
                        else {
                            if (!(0 >= cmp(d2.start, d1.start))) return null;
                            shift(d1, d2, 1);
                        }
                    } else if (!i1 && !i2) {
                        if (cmp(d2.start, d1.start) >= 0) shift(d2, d1, 1);
                        else {
                            if (!(0 >= cmp(d2.end, d1.start))) return null;
                            shift(d1, d2, -1);
                        }
                    }
                    return [
                        d2,
                        d1
                    ];
                }
                function shift(d1, d2, dir) {
                    shiftPos(d1.start, d2.start, d2.end, dir), shiftPos(d1.end, d2.start, d2.end, dir);
                }
                function shiftPos(pos, start, end, dir) {
                    pos.row == (1 == dir ? start : end).row && (pos.column += dir * (end.column - start.column)), pos.row += dir * (end.row - start.row);
                }
                function splitDelta(c, pos) {
                    var lines = c.lines, end = c.end;
                    c.end = clonePos(pos);
                    var rowsBefore = c.end.row - c.start.row, otherLines = lines.splice(rowsBefore, lines.length), col = rowsBefore ? pos.column : pos.column - c.start.column;
                    return lines.push(otherLines[0].substring(0, col)), otherLines[0] = otherLines[0].substr(col), {
                        start: clonePos(pos),
                        end: end,
                        lines: otherLines,
                        action: c.action
                    };
                }
                Range.comparePoints, exports.UndoManager = UndoManager;
            }), ace.define("ace/layer/lines", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom"), Lines = function(element, canvasHeight) {
                    this.element = element, this.canvasHeight = canvasHeight || 500000, this.element.style.height = 2 * this.canvasHeight + "px", this.cells = [], this.cellCache = [], this.$offsetCoefficient = 0;
                };
                (function() {
                    this.moveContainer = function(config) {
                        dom.translate(this.element, 0, -(config.firstRowScreen * config.lineHeight % this.canvasHeight) - config.offset * this.$offsetCoefficient);
                    }, this.pageChanged = function(oldConfig, newConfig) {
                        return Math.floor(oldConfig.firstRowScreen * oldConfig.lineHeight / this.canvasHeight) !== Math.floor(newConfig.firstRowScreen * newConfig.lineHeight / this.canvasHeight);
                    }, this.computeLineTop = function(row, config, session) {
                        var screenPage = Math.floor(config.firstRowScreen * config.lineHeight / this.canvasHeight);
                        return session.documentToScreenRow(row, 0) * config.lineHeight - screenPage * this.canvasHeight;
                    }, this.computeLineHeight = function(row, config, session) {
                        return config.lineHeight * session.getRowLineCount(row);
                    }, this.getLength = function() {
                        return this.cells.length;
                    }, this.get = function(index) {
                        return this.cells[index];
                    }, this.shift = function() {
                        this.$cacheCell(this.cells.shift());
                    }, this.pop = function() {
                        this.$cacheCell(this.cells.pop());
                    }, this.push = function(cell) {
                        if (Array.isArray(cell)) {
                            this.cells.push.apply(this.cells, cell);
                            for(var fragment = dom.createFragment(this.element), i = 0; i < cell.length; i++)fragment.appendChild(cell[i].element);
                            this.element.appendChild(fragment);
                        } else this.cells.push(cell), this.element.appendChild(cell.element);
                    }, this.unshift = function(cell) {
                        if (Array.isArray(cell)) {
                            this.cells.unshift.apply(this.cells, cell);
                            for(var fragment = dom.createFragment(this.element), i = 0; i < cell.length; i++)fragment.appendChild(cell[i].element);
                            this.element.firstChild ? this.element.insertBefore(fragment, this.element.firstChild) : this.element.appendChild(fragment);
                        } else this.cells.unshift(cell), this.element.insertAdjacentElement("afterbegin", cell.element);
                    }, this.last = function() {
                        return this.cells.length ? this.cells[this.cells.length - 1] : null;
                    }, this.$cacheCell = function(cell) {
                        cell && (cell.element.remove(), this.cellCache.push(cell));
                    }, this.createCell = function(row, config, session, initElement) {
                        var cell = this.cellCache.pop();
                        if (!cell) {
                            var element = dom.createElement("div");
                            initElement && initElement(element), this.element.appendChild(element), cell = {
                                element: element,
                                text: "",
                                row: row
                            };
                        }
                        return cell.row = row, cell;
                    };
                }).call(Lines.prototype), exports.Lines = Lines;
            }), ace.define("ace/layer/gutter", [
                "require",
                "exports",
                "module",
                "ace/lib/dom",
                "ace/lib/oop",
                "ace/lib/lang",
                "ace/lib/event_emitter",
                "ace/layer/lines"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom"), oop = require("../lib/oop"), lang = require("../lib/lang"), EventEmitter = require("../lib/event_emitter").EventEmitter, Lines = require("./lines").Lines, Gutter = function(parentEl) {
                    this.element = dom.createElement("div"), this.element.className = "ace_layer ace_gutter-layer", parentEl.appendChild(this.element), this.setShowFoldWidgets(this.$showFoldWidgets), this.gutterWidth = 0, this.$annotations = [], this.$updateAnnotations = this.$updateAnnotations.bind(this), this.$lines = new Lines(this.element), this.$lines.$offsetCoefficient = 1;
                };
                function onCreateCell(element) {
                    var textNode = document.createTextNode("");
                    element.appendChild(textNode);
                    var foldWidget = dom.createElement("span");
                    return element.appendChild(foldWidget), element;
                }
                (function() {
                    oop.implement(this, EventEmitter), this.setSession = function(session) {
                        this.session && this.session.off("change", this.$updateAnnotations), this.session = session, session && session.on("change", this.$updateAnnotations);
                    }, this.addGutterDecoration = function(row, className) {
                        window.console && console.warn && console.warn("deprecated use session.addGutterDecoration"), this.session.addGutterDecoration(row, className);
                    }, this.removeGutterDecoration = function(row, className) {
                        window.console && console.warn && console.warn("deprecated use session.removeGutterDecoration"), this.session.removeGutterDecoration(row, className);
                    }, this.setAnnotations = function(annotations) {
                        this.$annotations = [];
                        for(var i = 0; i < annotations.length; i++){
                            var annotation = annotations[i], row = annotation.row, rowInfo = this.$annotations[row];
                            rowInfo || (rowInfo = this.$annotations[row] = {
                                text: []
                            });
                            var annoText = annotation.text;
                            annoText = annoText ? lang.escapeHTML(annoText) : annotation.html || "", -1 === rowInfo.text.indexOf(annoText) && rowInfo.text.push(annoText);
                            var type = annotation.type;
                            "error" == type ? rowInfo.className = " ace_error" : "warning" == type && " ace_error" != rowInfo.className ? rowInfo.className = " ace_warning" : "info" != type || rowInfo.className || (rowInfo.className = " ace_info");
                        }
                    }, this.$updateAnnotations = function(delta) {
                        if (this.$annotations.length) {
                            var firstRow = delta.start.row, len = delta.end.row - firstRow;
                            if (0 === len) ;
                            else if ("remove" == delta.action) this.$annotations.splice(firstRow, len + 1, null);
                            else {
                                var args = Array(len + 1);
                                args.unshift(firstRow, 1), this.$annotations.splice.apply(this.$annotations, args);
                            }
                        }
                    }, this.update = function(config) {
                        this.config = config;
                        var session = this.session, firstRow = config.firstRow, lastRow = Math.min(config.lastRow + config.gutterOffset, session.getLength() - 1);
                        this.oldLastRow = lastRow, this.config = config, this.$lines.moveContainer(config), this.$updateCursorRow();
                        for(var fold = session.getNextFoldLine(firstRow), foldStart = fold ? fold.start.row : 1 / 0, cell = null, index = -1, row = firstRow;;){
                            if (row > foldStart && (row = fold.end.row + 1, foldStart = (fold = session.getNextFoldLine(row, fold)) ? fold.start.row : 1 / 0), row > lastRow) {
                                for(; this.$lines.getLength() > index + 1;)this.$lines.pop();
                                break;
                            }
                            (cell = this.$lines.get(++index)) ? cell.row = row : (cell = this.$lines.createCell(row, config, this.session, onCreateCell), this.$lines.push(cell)), this.$renderCell(cell, config, fold, row), row++;
                        }
                        this._signal("afterRender"), this.$updateGutterWidth(config);
                    }, this.$updateGutterWidth = function(config) {
                        var session = this.session, gutterRenderer = session.gutterRenderer || this.$renderer, firstLineNumber = session.$firstLineNumber, lastLineText = this.$lines.last() ? this.$lines.last().text : "";
                        (this.$fixedWidth || session.$useWrapMode) && (lastLineText = session.getLength() + firstLineNumber - 1);
                        var gutterWidth = gutterRenderer ? gutterRenderer.getWidth(session, lastLineText, config) : lastLineText.toString().length * config.characterWidth, padding = this.$padding || this.$computePadding();
                        (gutterWidth += padding.left + padding.right) === this.gutterWidth || isNaN(gutterWidth) || (this.gutterWidth = gutterWidth, this.element.parentNode.style.width = this.element.style.width = Math.ceil(this.gutterWidth) + "px", this._signal("changeGutterWidth", gutterWidth));
                    }, this.$updateCursorRow = function() {
                        if (this.$highlightGutterLine) {
                            var position = this.session.selection.getCursor();
                            this.$cursorRow !== position.row && (this.$cursorRow = position.row);
                        }
                    }, this.updateLineHighlight = function() {
                        if (this.$highlightGutterLine) {
                            var row = this.session.selection.cursor.row;
                            if (this.$cursorRow = row, !this.$cursorCell || this.$cursorCell.row != row) {
                                this.$cursorCell && (this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", ""));
                                var cells = this.$lines.cells;
                                this.$cursorCell = null;
                                for(var i = 0; i < cells.length; i++){
                                    var cell = cells[i];
                                    if (cell.row >= this.$cursorRow) {
                                        if (cell.row > this.$cursorRow) {
                                            var fold = this.session.getFoldLine(this.$cursorRow);
                                            if (i > 0 && fold && fold.start.row == cells[i - 1].row) cell = cells[i - 1];
                                            else break;
                                        }
                                        cell.element.className = "ace_gutter-active-line " + cell.element.className, this.$cursorCell = cell;
                                        break;
                                    }
                                }
                            }
                        }
                    }, this.scrollLines = function(config) {
                        var oldConfig = this.config;
                        if (this.config = config, this.$updateCursorRow(), this.$lines.pageChanged(oldConfig, config)) return this.update(config);
                        this.$lines.moveContainer(config);
                        var lastRow = Math.min(config.lastRow + config.gutterOffset, this.session.getLength() - 1), oldLastRow = this.oldLastRow;
                        if (this.oldLastRow = lastRow, !oldConfig || oldLastRow < config.firstRow || lastRow < oldConfig.firstRow) return this.update(config);
                        if (oldConfig.firstRow < config.firstRow) for(var row = this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row > 0; row--)this.$lines.shift();
                        if (oldLastRow > lastRow) for(var row = this.session.getFoldedRowCount(lastRow + 1, oldLastRow); row > 0; row--)this.$lines.pop();
                        config.firstRow < oldConfig.firstRow && this.$lines.unshift(this.$renderLines(config, config.firstRow, oldConfig.firstRow - 1)), lastRow > oldLastRow && this.$lines.push(this.$renderLines(config, oldLastRow + 1, lastRow)), this.updateLineHighlight(), this._signal("afterRender"), this.$updateGutterWidth(config);
                    }, this.$renderLines = function(config, firstRow, lastRow) {
                        for(var fragment = [], row = firstRow, foldLine = this.session.getNextFoldLine(row), foldStart = foldLine ? foldLine.start.row : 1 / 0; row > foldStart && (row = foldLine.end.row + 1, foldStart = (foldLine = this.session.getNextFoldLine(row, foldLine)) ? foldLine.start.row : 1 / 0), !(row > lastRow);){
                            var cell = this.$lines.createCell(row, config, this.session, onCreateCell);
                            this.$renderCell(cell, config, foldLine, row), fragment.push(cell), row++;
                        }
                        return fragment;
                    }, this.$renderCell = function(cell, config, fold, row) {
                        var element = cell.element, session = this.session, textNode = element.childNodes[0], foldWidget = element.childNodes[1], firstLineNumber = session.$firstLineNumber, breakpoints = session.$breakpoints, decorations = session.$decorations, gutterRenderer = session.gutterRenderer || this.$renderer, foldWidgets = this.$showFoldWidgets && session.foldWidgets, foldStart = fold ? fold.start.row : Number.MAX_VALUE, className = "ace_gutter-cell ";
                        if (this.$highlightGutterLine && (row == this.$cursorRow || fold && row < this.$cursorRow && row >= foldStart && this.$cursorRow <= fold.end.row) && (className += "ace_gutter-active-line ", this.$cursorCell != cell && (this.$cursorCell && (this.$cursorCell.element.className = this.$cursorCell.element.className.replace("ace_gutter-active-line ", "")), this.$cursorCell = cell)), breakpoints[row] && (className += breakpoints[row]), decorations[row] && (className += decorations[row]), this.$annotations[row] && (className += this.$annotations[row].className), element.className != className && (element.className = className), foldWidgets) {
                            var c = foldWidgets[row];
                            null == c && (c = foldWidgets[row] = session.getFoldWidget(row));
                        }
                        if (c) {
                            var className = "ace_fold-widget ace_" + c;
                            "start" == c && row == foldStart && row < fold.end.row ? className += " ace_closed" : className += " ace_open", foldWidget.className != className && (foldWidget.className = className);
                            var foldHeight = config.lineHeight + "px";
                            dom.setStyle(foldWidget.style, "height", foldHeight), dom.setStyle(foldWidget.style, "display", "inline-block");
                        } else foldWidget && dom.setStyle(foldWidget.style, "display", "none");
                        var text = (gutterRenderer ? gutterRenderer.getText(session, row) : row + firstLineNumber).toString();
                        return text !== textNode.data && (textNode.data = text), dom.setStyle(cell.element.style, "height", this.$lines.computeLineHeight(row, config, session) + "px"), dom.setStyle(cell.element.style, "top", this.$lines.computeLineTop(row, config, session) + "px"), cell.text = text, cell;
                    }, this.$fixedWidth = !1, this.$highlightGutterLine = !0, this.$renderer = "", this.setHighlightGutterLine = function(highlightGutterLine) {
                        this.$highlightGutterLine = highlightGutterLine;
                    }, this.$showLineNumbers = !0, this.$renderer = "", this.setShowLineNumbers = function(show) {
                        this.$renderer = !show && {
                            getWidth: function() {
                                return 0;
                            },
                            getText: function() {
                                return "";
                            }
                        };
                    }, this.getShowLineNumbers = function() {
                        return this.$showLineNumbers;
                    }, this.$showFoldWidgets = !0, this.setShowFoldWidgets = function(show) {
                        show ? dom.addCssClass(this.element, "ace_folding-enabled") : dom.removeCssClass(this.element, "ace_folding-enabled"), this.$showFoldWidgets = show, this.$padding = null;
                    }, this.getShowFoldWidgets = function() {
                        return this.$showFoldWidgets;
                    }, this.$computePadding = function() {
                        if (!this.element.firstChild) return {
                            left: 0,
                            right: 0
                        };
                        var style = dom.computedStyle(this.element.firstChild);
                        return this.$padding = {}, this.$padding.left = (parseInt(style.borderLeftWidth) || 0) + (parseInt(style.paddingLeft) || 0) + 1, this.$padding.right = (parseInt(style.borderRightWidth) || 0) + (parseInt(style.paddingRight) || 0), this.$padding;
                    }, this.getRegion = function(point) {
                        var padding = this.$padding || this.$computePadding(), rect = this.element.getBoundingClientRect();
                        return point.x < padding.left + rect.left ? "markers" : this.$showFoldWidgets && point.x > rect.right - padding.right ? "foldWidgets" : void 0;
                    };
                }).call(Gutter.prototype), exports.Gutter = Gutter;
            }), ace.define("ace/layer/marker", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("../range").Range, dom = require("../lib/dom"), Marker = function(parentEl) {
                    this.element = dom.createElement("div"), this.element.className = "ace_layer ace_marker-layer", parentEl.appendChild(this.element);
                };
                (function() {
                    this.$padding = 0, this.setPadding = function(padding) {
                        this.$padding = padding;
                    }, this.setSession = function(session) {
                        this.session = session;
                    }, this.setMarkers = function(markers) {
                        this.markers = markers;
                    }, this.elt = function(className, css) {
                        var x = -1 != this.i && this.element.childNodes[this.i];
                        x ? this.i++ : (x = document.createElement("div"), this.element.appendChild(x), this.i = -1), x.style.cssText = css, x.className = className;
                    }, this.update = function(config) {
                        if (config) {
                            for(var key in this.config = config, this.i = 0, this.markers){
                                var html, marker = this.markers[key];
                                if (!marker.range) {
                                    marker.update(html, this, this.session, config);
                                    continue;
                                }
                                var range = marker.range.clipRows(config.firstRow, config.lastRow);
                                if (!range.isEmpty()) {
                                    if (range = range.toScreenRange(this.session), marker.renderer) {
                                        var top = this.$getTop(range.start.row, config), left = this.$padding + range.start.column * config.characterWidth;
                                        marker.renderer(html, range, left, top, config);
                                    } else "fullLine" == marker.type ? this.drawFullLineMarker(html, range, marker.clazz, config) : "screenLine" == marker.type ? this.drawScreenLineMarker(html, range, marker.clazz, config) : range.isMultiLine() ? "text" == marker.type ? this.drawTextMarker(html, range, marker.clazz, config) : this.drawMultiLineMarker(html, range, marker.clazz, config) : this.drawSingleLineMarker(html, range, marker.clazz + " ace_start ace_br15", config);
                                }
                            }
                            if (-1 != this.i) for(; this.i < this.element.childElementCount;)this.element.removeChild(this.element.lastChild);
                        }
                    }, this.$getTop = function(row, layerConfig) {
                        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
                    }, this.drawTextMarker = function(stringBuilder, range, clazz, layerConfig, extraStyle) {
                        for(var session = this.session, start = range.start.row, end = range.end.row, row = start, prev = 0, curr = 0, next = session.getScreenLastRowColumn(row), lineRange = new Range(row, range.start.column, row, curr); row <= end; row++)lineRange.start.row = lineRange.end.row = row, lineRange.start.column = row == start ? range.start.column : session.getRowWrapIndent(row), lineRange.end.column = next, prev = curr, curr = next, next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row == end ? 0 : range.end.column, this.drawSingleLineMarker(stringBuilder, lineRange, clazz + (row == start ? " ace_start" : "") + " ace_br" + ((row == start || row == start + 1 && range.start.column ? 1 : 0) | (prev < curr ? 2 : 0) | (curr > next ? 4 : 0) | (row == end ? 8 : 0)), layerConfig, row == end ? 0 : 1, extraStyle);
                    }, this.drawMultiLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
                        var padding = this.$padding, height = config.lineHeight, top = this.$getTop(range.start.row, config), left = padding + range.start.column * config.characterWidth;
                        if (extraStyle = extraStyle || "", this.session.$bidiHandler.isBidiRow(range.start.row)) {
                            var range1 = range.clone();
                            range1.end.row = range1.start.row, range1.end.column = this.session.getLine(range1.start.row).length, this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br1 ace_start", config, null, extraStyle);
                        } else this.elt(clazz + " ace_br1 ace_start", "height:" + height + "px;right:0;top:" + top + "px;left:" + left + "px;" + (extraStyle || ""));
                        if (this.session.$bidiHandler.isBidiRow(range.end.row)) {
                            var range1 = range.clone();
                            range1.start.row = range1.end.row, range1.start.column = 0, this.drawBidiSingleLineMarker(stringBuilder, range1, clazz + " ace_br12", config, null, extraStyle);
                        } else {
                            top = this.$getTop(range.end.row, config);
                            var width = range.end.column * config.characterWidth;
                            this.elt(clazz + " ace_br12", "height:" + height + "px;width:" + width + "px;top:" + top + "px;left:" + padding + "px;" + (extraStyle || ""));
                        }
                        if (!((height = (range.end.row - range.start.row - 1) * config.lineHeight) <= 0)) {
                            top = this.$getTop(range.start.row + 1, config);
                            var radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);
                            this.elt(clazz + (radiusClass ? " ace_br" + radiusClass : ""), "height:" + height + "px;right:0;top:" + top + "px;left:" + padding + "px;" + (extraStyle || ""));
                        }
                    }, this.drawSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
                        if (this.session.$bidiHandler.isBidiRow(range.start.row)) return this.drawBidiSingleLineMarker(stringBuilder, range, clazz, config, extraLength, extraStyle);
                        var height = config.lineHeight, width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth, top = this.$getTop(range.start.row, config), left = this.$padding + range.start.column * config.characterWidth;
                        this.elt(clazz, "height:" + height + "px;width:" + width + "px;top:" + top + "px;left:" + left + "px;" + (extraStyle || ""));
                    }, this.drawBidiSingleLineMarker = function(stringBuilder, range, clazz, config, extraLength, extraStyle) {
                        var height = config.lineHeight, top = this.$getTop(range.start.row, config), padding = this.$padding;
                        this.session.$bidiHandler.getSelections(range.start.column, range.end.column).forEach(function(selection) {
                            this.elt(clazz, "height:" + height + "px;width:" + selection.width + (extraLength || 0) + "px;top:" + top + "px;left:" + (padding + selection.left) + "px;" + (extraStyle || ""));
                        }, this);
                    }, this.drawFullLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
                        var top = this.$getTop(range.start.row, config), height = config.lineHeight;
                        range.start.row != range.end.row && (height += this.$getTop(range.end.row, config) - top), this.elt(clazz, "height:" + height + "px;top:" + top + "px;left:0;right:0;" + (extraStyle || ""));
                    }, this.drawScreenLineMarker = function(stringBuilder, range, clazz, config, extraStyle) {
                        var top = this.$getTop(range.start.row, config), height = config.lineHeight;
                        this.elt(clazz, "height:" + height + "px;top:" + top + "px;left:0;right:0;" + (extraStyle || ""));
                    };
                }).call(Marker.prototype), exports.Marker = Marker;
            }), ace.define("ace/layer/text", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/layer/lines",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("../lib/oop"), dom = require("../lib/dom"), lang = require("../lib/lang"), Lines = require("./lines").Lines, EventEmitter = require("../lib/event_emitter").EventEmitter, Text = function(parentEl) {
                    this.dom = dom, this.element = this.dom.createElement("div"), this.element.className = "ace_layer ace_text-layer", parentEl.appendChild(this.element), this.$updateEolChar = this.$updateEolChar.bind(this), this.$lines = new Lines(this.element);
                };
                (function() {
                    oop.implement(this, EventEmitter), this.EOF_CHAR = "\xB6", this.EOL_CHAR_LF = "\xAC", this.EOL_CHAR_CRLF = "\xa4", this.EOL_CHAR = this.EOL_CHAR_LF, this.TAB_CHAR = "\u2014", this.SPACE_CHAR = "\xB7", this.$padding = 0, this.MAX_LINE_LENGTH = 10000, this.$updateEolChar = function() {
                        var doc = this.session.doc, EOL_CHAR = "\n" == doc.getNewLineCharacter() && "windows" != doc.getNewLineMode() ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
                        if (this.EOL_CHAR != EOL_CHAR) return this.EOL_CHAR = EOL_CHAR, !0;
                    }, this.setPadding = function(padding) {
                        this.$padding = padding, this.element.style.margin = "0 " + padding + "px";
                    }, this.getLineHeight = function() {
                        return this.$fontMetrics.$characterSize.height || 0;
                    }, this.getCharacterWidth = function() {
                        return this.$fontMetrics.$characterSize.width || 0;
                    }, this.$setFontMetrics = function(measure) {
                        this.$fontMetrics = measure, this.$fontMetrics.on("changeCharacterSize", (function(e) {
                            this._signal("changeCharacterSize", e);
                        }).bind(this)), this.$pollSizeChanges();
                    }, this.checkForSizeChanges = function() {
                        this.$fontMetrics.checkForSizeChanges();
                    }, this.$pollSizeChanges = function() {
                        return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
                    }, this.setSession = function(session) {
                        this.session = session, session && this.$computeTabString();
                    }, this.showInvisibles = !1, this.showSpaces = !1, this.showTabs = !1, this.showEOL = !1, this.setShowInvisibles = function(showInvisibles) {
                        return this.showInvisibles != showInvisibles && (this.showInvisibles = showInvisibles, "string" == typeof showInvisibles ? (this.showSpaces = /tab/i.test(showInvisibles), this.showTabs = /space/i.test(showInvisibles), this.showEOL = /eol/i.test(showInvisibles)) : this.showSpaces = this.showTabs = this.showEOL = showInvisibles, this.$computeTabString(), !0);
                    }, this.displayIndentGuides = !0, this.setDisplayIndentGuides = function(display) {
                        return this.displayIndentGuides != display && (this.displayIndentGuides = display, this.$computeTabString(), !0);
                    }, this.$tabStrings = [], this.onChangeTabSize = this.$computeTabString = function() {
                        var tabSize = this.session.getTabSize();
                        this.tabSize = tabSize;
                        for(var tabStr = this.$tabStrings = [
                            0
                        ], i = 1; i < tabSize + 1; i++)if (this.showTabs) {
                            var span = this.dom.createElement("span");
                            span.className = "ace_invisible ace_invisible_tab", span.textContent = lang.stringRepeat(this.TAB_CHAR, i), tabStr.push(span);
                        } else tabStr.push(this.dom.createTextNode(lang.stringRepeat(" ", i), this.element));
                        if (this.displayIndentGuides) {
                            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
                            var className = "ace_indent-guide", spaceClass = this.showSpaces ? " ace_invisible ace_invisible_space" : "", spaceContent = this.showSpaces ? lang.stringRepeat(this.SPACE_CHAR, this.tabSize) : lang.stringRepeat(" ", this.tabSize), tabClass = this.showTabs ? " ace_invisible ace_invisible_tab" : "", tabContent = this.showTabs ? lang.stringRepeat(this.TAB_CHAR, this.tabSize) : spaceContent, span = this.dom.createElement("span");
                            span.className = className + spaceClass, span.textContent = spaceContent, this.$tabStrings[" "] = span;
                            var span = this.dom.createElement("span");
                            span.className = className + tabClass, span.textContent = tabContent, this.$tabStrings["\t"] = span;
                        }
                    }, this.updateLines = function(config, firstRow, lastRow) {
                        if (this.config.lastRow != config.lastRow || this.config.firstRow != config.firstRow) return this.update(config);
                        this.config = config;
                        for(var first = Math.max(firstRow, config.firstRow), last = Math.min(lastRow, config.lastRow), lineElements = this.element.childNodes, lineElementsIdx = 0, row = config.firstRow; row < first; row++){
                            var foldLine = this.session.getFoldLine(row);
                            if (foldLine) {
                                if (foldLine.containsRow(first)) {
                                    first = foldLine.start.row;
                                    break;
                                }
                                row = foldLine.end.row;
                            }
                            lineElementsIdx++;
                        }
                        for(var heightChanged = !1, row = first, foldLine = this.session.getNextFoldLine(row), foldStart = foldLine ? foldLine.start.row : 1 / 0; row > foldStart && (row = foldLine.end.row + 1, foldStart = (foldLine = this.session.getNextFoldLine(row, foldLine)) ? foldLine.start.row : 1 / 0), !(row > last);){
                            var lineElement = lineElements[lineElementsIdx++];
                            if (lineElement) {
                                this.dom.removeChildren(lineElement), this.$renderLine(lineElement, row, row == foldStart && foldLine), heightChanged && (lineElement.style.top = this.$lines.computeLineTop(row, config, this.session) + "px");
                                var height = config.lineHeight * this.session.getRowLength(row) + "px";
                                lineElement.style.height != height && (heightChanged = !0, lineElement.style.height = height);
                            }
                            row++;
                        }
                        if (heightChanged) for(; lineElementsIdx < this.$lines.cells.length;){
                            var cell = this.$lines.cells[lineElementsIdx++];
                            cell.element.style.top = this.$lines.computeLineTop(cell.row, config, this.session) + "px";
                        }
                    }, this.scrollLines = function(config) {
                        var oldConfig = this.config;
                        if (this.config = config, this.$lines.pageChanged(oldConfig, config)) return this.update(config);
                        this.$lines.moveContainer(config);
                        var lastRow = config.lastRow, oldLastRow = oldConfig ? oldConfig.lastRow : -1;
                        if (!oldConfig || oldLastRow < config.firstRow || lastRow < oldConfig.firstRow || !oldConfig || oldConfig.lastRow < config.firstRow || config.lastRow < oldConfig.firstRow) return this.update(config);
                        if (oldConfig.firstRow < config.firstRow) for(var row = this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row > 0; row--)this.$lines.shift();
                        if (oldConfig.lastRow > config.lastRow) for(var row = this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row > 0; row--)this.$lines.pop();
                        config.firstRow < oldConfig.firstRow && this.$lines.unshift(this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1)), config.lastRow > oldConfig.lastRow && this.$lines.push(this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow));
                    }, this.$renderLinesFragment = function(config, firstRow, lastRow) {
                        for(var fragment = [], row = firstRow, foldLine = this.session.getNextFoldLine(row), foldStart = foldLine ? foldLine.start.row : 1 / 0; row > foldStart && (row = foldLine.end.row + 1, foldStart = (foldLine = this.session.getNextFoldLine(row, foldLine)) ? foldLine.start.row : 1 / 0), !(row > lastRow);){
                            var line = this.$lines.createCell(row, config, this.session), lineEl = line.element;
                            this.dom.removeChildren(lineEl), dom.setStyle(lineEl.style, "height", this.$lines.computeLineHeight(row, config, this.session) + "px"), dom.setStyle(lineEl.style, "top", this.$lines.computeLineTop(row, config, this.session) + "px"), this.$renderLine(lineEl, row, row == foldStart && foldLine), this.$useLineGroups() ? lineEl.className = "ace_line_group" : lineEl.className = "ace_line", fragment.push(line), row++;
                        }
                        return fragment;
                    }, this.update = function(config) {
                        this.$lines.moveContainer(config), this.config = config;
                        for(var firstRow = config.firstRow, lastRow = config.lastRow, lines = this.$lines; lines.getLength();)lines.pop();
                        lines.push(this.$renderLinesFragment(config, firstRow, lastRow));
                    }, this.$textToken = {
                        text: !0,
                        rparen: !0,
                        lparen: !0
                    }, this.$renderToken = function(parent, screenColumn, token, value) {
                        for(var m, re = /(\t)|( +)|([\x00-\x1f\x80-\xa0\xad\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\uFEFF\uFFF9-\uFFFC]+)|(\u3000)|([\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g, valueFragment = this.dom.createFragment(this.element), i = 0; m = re.exec(value);){
                            var tab = m[1], simpleSpace = m[2], controlCharacter = m[3], cjkSpace = m[4], cjk = m[5];
                            if (this.showSpaces || !simpleSpace) {
                                var before = i != m.index ? value.slice(i, m.index) : "";
                                if (i = m.index + m[0].length, before && valueFragment.appendChild(this.dom.createTextNode(before, this.element)), tab) {
                                    var tabSize = this.session.getScreenTabSize(screenColumn + m.index);
                                    valueFragment.appendChild(this.$tabStrings[tabSize].cloneNode(!0)), screenColumn += tabSize - 1;
                                } else if (simpleSpace) {
                                    if (this.showSpaces) {
                                        var span = this.dom.createElement("span");
                                        span.className = "ace_invisible ace_invisible_space", span.textContent = lang.stringRepeat(this.SPACE_CHAR, simpleSpace.length), valueFragment.appendChild(span);
                                    } else valueFragment.appendChild(this.com.createTextNode(simpleSpace, this.element));
                                } else if (controlCharacter) {
                                    var span = this.dom.createElement("span");
                                    span.className = "ace_invisible ace_invisible_space ace_invalid", span.textContent = lang.stringRepeat(this.SPACE_CHAR, controlCharacter.length), valueFragment.appendChild(span);
                                } else if (cjkSpace) {
                                    screenColumn += 1;
                                    var span = this.dom.createElement("span");
                                    span.style.width = 2 * this.config.characterWidth + "px", span.className = this.showSpaces ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk", span.textContent = this.showSpaces ? this.SPACE_CHAR : cjkSpace, valueFragment.appendChild(span);
                                } else if (cjk) {
                                    screenColumn += 1;
                                    var span = this.dom.createElement("span");
                                    span.style.width = 2 * this.config.characterWidth + "px", span.className = "ace_cjk", span.textContent = cjk, valueFragment.appendChild(span);
                                }
                            }
                        }
                        if (valueFragment.appendChild(this.dom.createTextNode(i ? value.slice(i) : value, this.element)), this.$textToken[token.type]) parent.appendChild(valueFragment);
                        else {
                            var classes = "ace_" + token.type.replace(/\./g, " ace_"), span = this.dom.createElement("span");
                            "fold" == token.type && (span.style.width = token.value.length * this.config.characterWidth + "px"), span.className = classes, span.appendChild(valueFragment), parent.appendChild(span);
                        }
                        return screenColumn + value.length;
                    }, this.renderIndentGuide = function(parent, value, max) {
                        var cols = value.search(this.$indentGuideRe);
                        if (cols <= 0 || cols >= max) return value;
                        if (" " == value[0]) {
                            for(var count = (cols -= cols % this.tabSize) / this.tabSize, i = 0; i < count; i++)parent.appendChild(this.$tabStrings[" "].cloneNode(!0));
                            return value.substr(cols);
                        }
                        if ("\t" == value[0]) {
                            for(var i = 0; i < cols; i++)parent.appendChild(this.$tabStrings["\t"].cloneNode(!0));
                            return value.substr(cols);
                        }
                        return value;
                    }, this.$createLineElement = function(parent) {
                        var lineEl = this.dom.createElement("div");
                        return lineEl.className = "ace_line", lineEl.style.height = this.config.lineHeight + "px", lineEl;
                    }, this.$renderWrappedLine = function(parent, tokens, splits) {
                        var chars = 0, split = 0, splitChars = splits[0], screenColumn = 0, lineEl = this.$createLineElement();
                        parent.appendChild(lineEl);
                        for(var i = 0; i < tokens.length; i++){
                            var token = tokens[i], value = token.value;
                            if (0 == i && this.displayIndentGuides) {
                                if (chars = value.length, !(value = this.renderIndentGuide(lineEl, value, splitChars))) continue;
                                chars -= value.length;
                            }
                            if (chars + value.length < splitChars) screenColumn = this.$renderToken(lineEl, screenColumn, token, value), chars += value.length;
                            else {
                                for(; chars + value.length >= splitChars;)screenColumn = this.$renderToken(lineEl, screenColumn, token, value.substring(0, splitChars - chars)), value = value.substring(splitChars - chars), chars = splitChars, lineEl = this.$createLineElement(), parent.appendChild(lineEl), lineEl.appendChild(this.dom.createTextNode(lang.stringRepeat("\xa0", splits.indent), this.element)), screenColumn = 0, splitChars = splits[++split] || Number.MAX_VALUE;
                                0 != value.length && (chars += value.length, screenColumn = this.$renderToken(lineEl, screenColumn, token, value));
                            }
                        }
                        splits[splits.length - 1] > this.MAX_LINE_LENGTH && this.$renderOverflowMessage(lineEl, screenColumn, null, "", !0);
                    }, this.$renderSimpleLine = function(parent, tokens) {
                        var screenColumn = 0, token = tokens[0], value = token.value;
                        this.displayIndentGuides && (value = this.renderIndentGuide(parent, value)), value && (screenColumn = this.$renderToken(parent, screenColumn, token, value));
                        for(var i = 1; i < tokens.length; i++){
                            if (screenColumn + (value = (token = tokens[i]).value).length > this.MAX_LINE_LENGTH) return this.$renderOverflowMessage(parent, screenColumn, token, value);
                            screenColumn = this.$renderToken(parent, screenColumn, token, value);
                        }
                    }, this.$renderOverflowMessage = function(parent, screenColumn, token, value, hide) {
                        token && this.$renderToken(parent, screenColumn, token, value.slice(0, this.MAX_LINE_LENGTH - screenColumn));
                        var overflowEl = this.dom.createElement("span");
                        overflowEl.className = "ace_inline_button ace_keyword ace_toggle_wrap", overflowEl.textContent = hide ? "<hide>" : "<click to see more...>", parent.appendChild(overflowEl);
                    }, this.$renderLine = function(parent, row, foldLine) {
                        if (foldLine || !1 == foldLine || (foldLine = this.session.getFoldLine(row)), foldLine) var tokens = this.$getFoldLineTokens(row, foldLine);
                        else var tokens = this.session.getTokens(row);
                        var lastLineEl = parent;
                        if (tokens.length) {
                            var splits = this.session.getRowSplitData(row);
                            if (splits && splits.length) {
                                this.$renderWrappedLine(parent, tokens, splits);
                                var lastLineEl = parent.lastChild;
                            } else {
                                var lastLineEl = parent;
                                this.$useLineGroups() && (lastLineEl = this.$createLineElement(), parent.appendChild(lastLineEl)), this.$renderSimpleLine(lastLineEl, tokens);
                            }
                        } else this.$useLineGroups() && (lastLineEl = this.$createLineElement(), parent.appendChild(lastLineEl));
                        if (this.showEOL && lastLineEl) {
                            foldLine && (row = foldLine.end.row);
                            var invisibleEl = this.dom.createElement("span");
                            invisibleEl.className = "ace_invisible ace_invisible_eol", invisibleEl.textContent = row == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR, lastLineEl.appendChild(invisibleEl);
                        }
                    }, this.$getFoldLineTokens = function(row, foldLine) {
                        var session = this.session, renderTokens = [], tokens = session.getTokens(row);
                        return foldLine.walk(function(placeholder, row, column, lastColumn, isNewRow) {
                            null != placeholder ? renderTokens.push({
                                type: "fold",
                                value: placeholder
                            }) : (isNewRow && (tokens = session.getTokens(row)), tokens.length && function(tokens, from, to) {
                                for(var idx = 0, col = 0; col + tokens[idx].value.length < from;)if (col += tokens[idx].value.length, ++idx == tokens.length) return;
                                if (col != from) {
                                    var value = tokens[idx].value.substring(from - col);
                                    value.length > to - from && (value = value.substring(0, to - from)), renderTokens.push({
                                        type: tokens[idx].type,
                                        value: value
                                    }), col = from + value.length, idx += 1;
                                }
                                for(; col < to && idx < tokens.length;){
                                    var value = tokens[idx].value;
                                    value.length + col > to ? renderTokens.push({
                                        type: tokens[idx].type,
                                        value: value.substring(0, to - col)
                                    }) : renderTokens.push(tokens[idx]), col += value.length, idx += 1;
                                }
                            }(tokens, lastColumn, column));
                        }, foldLine.end.row, this.session.getLine(foldLine.end.row).length), renderTokens;
                    }, this.$useLineGroups = function() {
                        return this.session.getUseWrapMode();
                    }, this.destroy = function() {};
                }).call(Text.prototype), exports.Text = Text;
            }), ace.define("ace/layer/cursor", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("../lib/dom"), Cursor = function(parentEl) {
                    this.element = dom.createElement("div"), this.element.className = "ace_layer ace_cursor-layer", parentEl.appendChild(this.element), this.isVisible = !1, this.isBlinking = !0, this.blinkInterval = 1000, this.smoothBlinking = !1, this.cursors = [], this.cursor = this.addCursor(), dom.addCssClass(this.element, "ace_hidden-cursors"), this.$updateCursors = this.$updateOpacity.bind(this);
                };
                (function() {
                    this.$updateOpacity = function(val) {
                        for(var cursors = this.cursors, i = cursors.length; i--;)dom.setStyle(cursors[i].style, "opacity", val ? "" : "0");
                    }, this.$startCssAnimation = function() {
                        for(var cursors = this.cursors, i = cursors.length; i--;)cursors[i].style.animationDuration = this.blinkInterval + "ms";
                        this.$isAnimating = !0, setTimeout((function() {
                            this.$isAnimating && dom.addCssClass(this.element, "ace_animate-blinking");
                        }).bind(this));
                    }, this.$stopCssAnimation = function() {
                        this.$isAnimating = !1, dom.removeCssClass(this.element, "ace_animate-blinking");
                    }, this.$padding = 0, this.setPadding = function(padding) {
                        this.$padding = padding;
                    }, this.setSession = function(session) {
                        this.session = session;
                    }, this.setBlinking = function(blinking) {
                        blinking != this.isBlinking && (this.isBlinking = blinking, this.restartTimer());
                    }, this.setBlinkInterval = function(blinkInterval) {
                        blinkInterval != this.blinkInterval && (this.blinkInterval = blinkInterval, this.restartTimer());
                    }, this.setSmoothBlinking = function(smoothBlinking) {
                        smoothBlinking != this.smoothBlinking && (this.smoothBlinking = smoothBlinking, dom.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking), this.$updateCursors(!0), this.restartTimer());
                    }, this.addCursor = function() {
                        var el = dom.createElement("div");
                        return el.className = "ace_cursor", this.element.appendChild(el), this.cursors.push(el), el;
                    }, this.removeCursor = function() {
                        if (this.cursors.length > 1) {
                            var el = this.cursors.pop();
                            return el.parentNode.removeChild(el), el;
                        }
                    }, this.hideCursor = function() {
                        this.isVisible = !1, dom.addCssClass(this.element, "ace_hidden-cursors"), this.restartTimer();
                    }, this.showCursor = function() {
                        this.isVisible = !0, dom.removeCssClass(this.element, "ace_hidden-cursors"), this.restartTimer();
                    }, this.restartTimer = function() {
                        var update = this.$updateCursors;
                        if (clearInterval(this.intervalId), clearTimeout(this.timeoutId), this.$stopCssAnimation(), this.smoothBlinking && (this.$isSmoothBlinking = !1, dom.removeCssClass(this.element, "ace_smooth-blinking")), update(!0), !this.isBlinking || !this.blinkInterval || !this.isVisible) {
                            this.$stopCssAnimation();
                            return;
                        }
                        if (this.smoothBlinking && (this.$isSmoothBlinking = !0, setTimeout((function() {
                            this.$isSmoothBlinking && dom.addCssClass(this.element, "ace_smooth-blinking");
                        }).bind(this))), dom.HAS_CSS_ANIMATION) this.$startCssAnimation();
                        else {
                            var blink = (function() {
                                this.timeoutId = setTimeout(function() {
                                    update(!1);
                                }, 0.6 * this.blinkInterval);
                            }).bind(this);
                            this.intervalId = setInterval(function() {
                                update(!0), blink();
                            }, this.blinkInterval), blink();
                        }
                    }, this.getPixelPosition = function(position, onScreen) {
                        if (!this.config || !this.session) return {
                            left: 0,
                            top: 0
                        };
                        position || (position = this.session.selection.getCursor());
                        var pos = this.session.documentToScreenPosition(position);
                        return {
                            left: this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, position.row) ? this.session.$bidiHandler.getPosLeft(pos.column) : pos.column * this.config.characterWidth),
                            top: (pos.row - (onScreen ? this.config.firstRowScreen : 0)) * this.config.lineHeight
                        };
                    }, this.isCursorInView = function(pixelPos, config) {
                        return pixelPos.top >= 0 && pixelPos.top < config.maxHeight;
                    }, this.update = function(config) {
                        this.config = config;
                        var selections = this.session.$selectionMarkers, i = 0, cursorIndex = 0;
                        (void 0 === selections || 0 === selections.length) && (selections = [
                            {
                                cursor: null
                            }
                        ]);
                        for(var i = 0, n = selections.length; i < n; i++){
                            var pixelPos = this.getPixelPosition(selections[i].cursor, !0);
                            if (!(pixelPos.top > config.height + config.offset) && !(pixelPos.top < 0) || !(i > 1)) {
                                var element = this.cursors[cursorIndex++] || this.addCursor(), style = element.style;
                                this.drawCursor ? this.drawCursor(element, pixelPos, config, selections[i], this.session) : this.isCursorInView(pixelPos, config) ? (dom.setStyle(style, "display", "block"), dom.translate(element, pixelPos.left, pixelPos.top), dom.setStyle(style, "width", Math.round(config.characterWidth) + "px"), dom.setStyle(style, "height", config.lineHeight + "px")) : dom.setStyle(style, "display", "none");
                            }
                        }
                        for(; this.cursors.length > cursorIndex;)this.removeCursor();
                        var overwrite = this.session.getOverwrite();
                        this.$setOverwrite(overwrite), this.$pixelPos = pixelPos, this.restartTimer();
                    }, this.drawCursor = null, this.$setOverwrite = function(overwrite) {
                        overwrite != this.overwrite && (this.overwrite = overwrite, overwrite ? dom.addCssClass(this.element, "ace_overwrite-cursors") : dom.removeCssClass(this.element, "ace_overwrite-cursors"));
                    }, this.destroy = function() {
                        clearInterval(this.intervalId), clearTimeout(this.timeoutId);
                    };
                }).call(Cursor.prototype), exports.Cursor = Cursor;
            }), ace.define("ace/scrollbar", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/event",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), dom = require("./lib/dom"), event = require("./lib/event"), EventEmitter = require("./lib/event_emitter").EventEmitter, ScrollBar = function(parent) {
                    this.element = dom.createElement("div"), this.element.className = "ace_scrollbar ace_scrollbar" + this.classSuffix, this.inner = dom.createElement("div"), this.inner.className = "ace_scrollbar-inner", this.inner.textContent = "\xa0", this.element.appendChild(this.inner), parent.appendChild(this.element), this.setVisible(!1), this.skipEvent = !1, event.addListener(this.element, "scroll", this.onScroll.bind(this)), event.addListener(this.element, "mousedown", event.preventDefault);
                };
                (function() {
                    oop.implement(this, EventEmitter), this.setVisible = function(isVisible) {
                        this.element.style.display = isVisible ? "" : "none", this.isVisible = isVisible, this.coeff = 1;
                    };
                }).call(ScrollBar.prototype);
                var VScrollBar = function(parent, renderer) {
                    ScrollBar.call(this, parent), this.scrollTop = 0, this.scrollHeight = 0, renderer.$scrollbarWidth = this.width = dom.scrollbarWidth(parent.ownerDocument), this.inner.style.width = this.element.style.width = (this.width || 15) + 5 + "px", this.$minWidth = 0;
                };
                oop.inherits(VScrollBar, ScrollBar), (function() {
                    this.classSuffix = "-v", this.onScroll = function() {
                        if (!this.skipEvent) {
                            if (this.scrollTop = this.element.scrollTop, 1 != this.coeff) {
                                var h = this.element.clientHeight / this.scrollHeight;
                                this.scrollTop = this.scrollTop * (1 - h) / (this.coeff - h);
                            }
                            this._emit("scroll", {
                                data: this.scrollTop
                            });
                        }
                        this.skipEvent = !1;
                    }, this.getWidth = function() {
                        return Math.max(this.isVisible ? this.width : 0, this.$minWidth || 0);
                    }, this.setHeight = function(height) {
                        this.element.style.height = height + "px";
                    }, this.setInnerHeight = this.setScrollHeight = function(height) {
                        this.scrollHeight = height, height > 0x8000 ? (this.coeff = 0x8000 / height, height = 0x8000) : 1 != this.coeff && (this.coeff = 1), this.inner.style.height = height + "px";
                    }, this.setScrollTop = function(scrollTop) {
                        this.scrollTop != scrollTop && (this.skipEvent = !0, this.scrollTop = scrollTop, this.element.scrollTop = scrollTop * this.coeff);
                    };
                }).call(VScrollBar.prototype);
                var HScrollBar = function(parent, renderer) {
                    ScrollBar.call(this, parent), this.scrollLeft = 0, this.height = renderer.$scrollbarWidth, this.inner.style.height = this.element.style.height = (this.height || 15) + 5 + "px";
                };
                oop.inherits(HScrollBar, ScrollBar), (function() {
                    this.classSuffix = "-h", this.onScroll = function() {
                        this.skipEvent || (this.scrollLeft = this.element.scrollLeft, this._emit("scroll", {
                            data: this.scrollLeft
                        })), this.skipEvent = !1;
                    }, this.getHeight = function() {
                        return this.isVisible ? this.height : 0;
                    }, this.setWidth = function(width) {
                        this.element.style.width = width + "px";
                    }, this.setInnerWidth = function(width) {
                        this.inner.style.width = width + "px";
                    }, this.setScrollWidth = function(width) {
                        this.inner.style.width = width + "px";
                    }, this.setScrollLeft = function(scrollLeft) {
                        this.scrollLeft != scrollLeft && (this.skipEvent = !0, this.scrollLeft = this.element.scrollLeft = scrollLeft);
                    };
                }).call(HScrollBar.prototype), exports.ScrollBar = VScrollBar, exports.ScrollBarV = VScrollBar, exports.ScrollBarH = HScrollBar, exports.VScrollBar = VScrollBar, exports.HScrollBar = HScrollBar;
            }), ace.define("ace/renderloop", [
                "require",
                "exports",
                "module",
                "ace/lib/event"
            ], function(require, exports, module) {
                "use strict";
                var event = require("./lib/event"), RenderLoop = function(onRender, win) {
                    this.onRender = onRender, this.pending = !1, this.changes = 0, this.$recursionLimit = 2, this.window = win || window;
                    var _self = this;
                    this._flush = function(ts) {
                        _self.pending = !1;
                        var changes = _self.changes;
                        if (changes && (event.blockIdle(100), _self.changes = 0, _self.onRender(changes)), _self.changes) {
                            if (_self.$recursionLimit-- < 0) return;
                            _self.schedule();
                        } else _self.$recursionLimit = 2;
                    };
                };
                (function() {
                    this.schedule = function(change) {
                        this.changes = this.changes | change, this.changes && !this.pending && (event.nextFrame(this._flush), this.pending = !0);
                    }, this.clear = function(change) {
                        var changes = this.changes;
                        return this.changes = 0, changes;
                    };
                }).call(RenderLoop.prototype), exports.RenderLoop = RenderLoop;
            }), ace.define("ace/layer/font_metrics", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/dom",
                "ace/lib/lang",
                "ace/lib/event",
                "ace/lib/useragent",
                "ace/lib/event_emitter"
            ], function(require, exports, module) {
                var oop = require("../lib/oop"), dom = require("../lib/dom"), lang = require("../lib/lang"), event = require("../lib/event"), useragent = require("../lib/useragent"), EventEmitter = require("../lib/event_emitter").EventEmitter, USE_OBSERVER = "function" == typeof ResizeObserver;
                (function() {
                    oop.implement(this, EventEmitter), this.$characterSize = {
                        width: 0,
                        height: 0
                    }, this.$setMeasureNodeStyles = function(style, isRoot) {
                        style.width = style.height = "auto", style.left = style.top = "0px", style.visibility = "hidden", style.position = "absolute", style.whiteSpace = "pre", useragent.isIE < 8 ? style["font-family"] = "inherit" : style.font = "inherit", style.overflow = isRoot ? "hidden" : "visible";
                    }, this.checkForSizeChanges = function(size) {
                        if (void 0 === size && (size = this.$measureSizes()), size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
                            this.$measureNode.style.fontWeight = "bold";
                            var boldSize = this.$measureSizes();
                            this.$measureNode.style.fontWeight = "", this.$characterSize = size, this.charSizes = Object.create(null), this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height, this._emit("changeCharacterSize", {
                                data: size
                            });
                        }
                    }, this.$addObserver = function() {
                        var self1 = this;
                        this.$observer = new window.ResizeObserver(function(e) {
                            self1.checkForSizeChanges();
                        }), this.$observer.observe(this.$measureNode);
                    }, this.$pollSizeChanges = function() {
                        if (this.$pollSizeChangesTimer || this.$observer) return this.$pollSizeChangesTimer;
                        var self1 = this;
                        return this.$pollSizeChangesTimer = event.onIdle(function cb() {
                            self1.checkForSizeChanges(), event.onIdle(cb, 500);
                        }, 500);
                    }, this.setPolling = function(val) {
                        val ? this.$pollSizeChanges() : this.$pollSizeChangesTimer && (clearInterval(this.$pollSizeChangesTimer), this.$pollSizeChangesTimer = 0);
                    }, this.$measureSizes = function(node) {
                        var size = {
                            height: (node || this.$measureNode).clientHeight,
                            width: (node || this.$measureNode).clientWidth / 256
                        };
                        return 0 === size.width || 0 === size.height ? null : size;
                    }, this.$measureCharWidth = function(ch) {
                        return this.$main.textContent = lang.stringRepeat(ch, 256), this.$main.getBoundingClientRect().width / 256;
                    }, this.getCharacterWidth = function(ch) {
                        var w = this.charSizes[ch];
                        return void 0 === w && (w = this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width), w;
                    }, this.destroy = function() {
                        clearInterval(this.$pollSizeChangesTimer), this.$observer && this.$observer.disconnect(), this.el && this.el.parentNode && this.el.parentNode.removeChild(this.el);
                    }, this.$getZoom = function getZoom(element) {
                        return element && element.parentElement ? (window.getComputedStyle(element).zoom || 1) * getZoom(element.parentElement) : 1;
                    }, this.$initTransformMeasureNodes = function() {
                        var t = function(t, l) {
                            return [
                                "div",
                                {
                                    style: "position: absolute;top:" + t + "px;left:" + l + "px;"
                                }
                            ];
                        };
                        this.els = dom.buildDom([
                            t(0, 0),
                            t(200, 0),
                            t(0, 200),
                            t(200, 200)
                        ], this.el);
                    }, this.transformCoordinates = function(clientPos, elPos) {
                        function solve(l1, l2, r) {
                            var det = l1[1] * l2[0] - l1[0] * l2[1];
                            return [
                                (-l2[1] * r[0] + l2[0] * r[1]) / det,
                                (+l1[1] * r[0] - l1[0] * r[1]) / det
                            ];
                        }
                        function sub(a, b) {
                            return [
                                a[0] - b[0],
                                a[1] - b[1]
                            ];
                        }
                        function add(a, b) {
                            return [
                                a[0] + b[0],
                                a[1] + b[1]
                            ];
                        }
                        function mul(a, b) {
                            return [
                                a * b[0],
                                a * b[1]
                            ];
                        }
                        function p(el) {
                            var r = el.getBoundingClientRect();
                            return [
                                r.left,
                                r.top
                            ];
                        }
                        clientPos && (clientPos = mul(1 / this.$getZoom(this.el), clientPos)), this.els || this.$initTransformMeasureNodes();
                        var a = p(this.els[0]), b = p(this.els[1]), c = p(this.els[2]), d = p(this.els[3]), h = solve(sub(d, b), sub(d, c), sub(add(b, c), add(d, a))), m1 = mul(1 + h[0], sub(b, a)), m2 = mul(1 + h[1], sub(c, a));
                        if (elPos) {
                            var k = h[0] * elPos[0] / 200 + h[1] * elPos[1] / 200 + 1, ut = add(mul(elPos[0], m1), mul(elPos[1], m2));
                            return add(mul(1 / k / 200, ut), a);
                        }
                        var u = sub(clientPos, a), f = solve(sub(m1, mul(h[0], u)), sub(m2, mul(h[1], u)), u);
                        return mul(200, f);
                    };
                }).call((exports.FontMetrics = function(parentEl) {
                    this.el = dom.createElement("div"), this.$setMeasureNodeStyles(this.el.style, !0), this.$main = dom.createElement("div"), this.$setMeasureNodeStyles(this.$main.style), this.$measureNode = dom.createElement("div"), this.$setMeasureNodeStyles(this.$measureNode.style), this.el.appendChild(this.$main), this.el.appendChild(this.$measureNode), parentEl.appendChild(this.el), this.$measureNode.textContent = lang.stringRepeat("X", 256), this.$characterSize = {
                        width: 0,
                        height: 0
                    }, USE_OBSERVER ? this.$addObserver() : this.checkForSizeChanges();
                }).prototype);
            }), ace.define("ace/virtual_renderer", [
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
                "ace/lib/useragent"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("./lib/oop"), dom = require("./lib/dom"), config = require("./config"), GutterLayer = require("./layer/gutter").Gutter, MarkerLayer = require("./layer/marker").Marker, TextLayer = require("./layer/text").Text, CursorLayer = require("./layer/cursor").Cursor, HScrollBar = require("./scrollbar").HScrollBar, VScrollBar = require("./scrollbar").VScrollBar, RenderLoop = require("./renderloop").RenderLoop, FontMetrics = require("./layer/font_metrics").FontMetrics, EventEmitter = require("./lib/event_emitter").EventEmitter, editorCss = '\
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
}', useragent = require("./lib/useragent"), HIDE_TEXTAREA = useragent.isIE;
                dom.importCssString(editorCss, "ace_editor.css", !1);
                var VirtualRenderer = function(container, theme) {
                    var _self = this;
                    this.container = container || dom.createElement("div"), dom.addCssClass(this.container, "ace_editor"), dom.HI_DPI && dom.addCssClass(this.container, "ace_hidpi"), this.setTheme(theme), null == config.get("useStrictCSP") && config.set("useStrictCSP", !1), this.$gutter = dom.createElement("div"), this.$gutter.className = "ace_gutter", this.container.appendChild(this.$gutter), this.$gutter.setAttribute("aria-hidden", !0), this.scroller = dom.createElement("div"), this.scroller.className = "ace_scroller", this.container.appendChild(this.scroller), this.content = dom.createElement("div"), this.content.className = "ace_content", this.scroller.appendChild(this.content), this.$gutterLayer = new GutterLayer(this.$gutter), this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this)), this.$markerBack = new MarkerLayer(this.content);
                    var textLayer = this.$textLayer = new TextLayer(this.content);
                    this.canvas = textLayer.element, this.$markerFront = new MarkerLayer(this.content), this.$cursorLayer = new CursorLayer(this.content), this.$horizScroll = !1, this.$vScroll = !1, this.scrollBar = this.scrollBarV = new VScrollBar(this.container, this), this.scrollBarH = new HScrollBar(this.container, this), this.scrollBarV.on("scroll", function(e) {
                        _self.$scrollAnimation || _self.session.setScrollTop(e.data - _self.scrollMargin.top);
                    }), this.scrollBarH.on("scroll", function(e) {
                        _self.$scrollAnimation || _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
                    }), this.scrollTop = 0, this.scrollLeft = 0, this.cursorPos = {
                        row: 0,
                        column: 0
                    }, this.$fontMetrics = new FontMetrics(this.container), this.$textLayer.$setFontMetrics(this.$fontMetrics), this.$textLayer.on("changeCharacterSize", function(e) {
                        _self.updateCharacterSize(), _self.onResize(!0, _self.gutterWidth, _self.$size.width, _self.$size.height), _self._signal("changeCharacterSize", e);
                    }), this.$size = {
                        width: 0,
                        height: 0,
                        scrollerHeight: 0,
                        scrollerWidth: 0,
                        $dirty: !0
                    }, this.layerConfig = {
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
                    }, this.scrollMargin = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        v: 0,
                        h: 0
                    }, this.margin = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        v: 0,
                        h: 0
                    }, this.$keepTextAreaAtCursor = !useragent.isIOS, this.$loop = new RenderLoop(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView), this.$loop.schedule(this.CHANGE_FULL), this.updateCharacterSize(), this.setPadding(4), config.resetOptions(this), config._signal("renderer", this);
                };
                (function() {
                    this.CHANGE_CURSOR = 1, this.CHANGE_MARKER = 2, this.CHANGE_GUTTER = 4, this.CHANGE_SCROLL = 8, this.CHANGE_LINES = 16, this.CHANGE_TEXT = 32, this.CHANGE_SIZE = 64, this.CHANGE_MARKER_BACK = 128, this.CHANGE_MARKER_FRONT = 256, this.CHANGE_FULL = 512, this.CHANGE_H_SCROLL = 1024, oop.implement(this, EventEmitter), this.updateCharacterSize = function() {
                        this.$textLayer.allowBoldFonts != this.$allowBoldFonts && (this.$allowBoldFonts = this.$textLayer.allowBoldFonts, this.setStyle("ace_nobold", !this.$allowBoldFonts)), this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth(), this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight(), this.$updatePrintMargin(), dom.setStyle(this.scroller.style, "line-height", this.lineHeight + "px");
                    }, this.setSession = function(session) {
                        this.session && this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode), this.session = session, session && this.scrollMargin.top && 0 >= session.getScrollTop() && session.setScrollTop(-this.scrollMargin.top), this.$cursorLayer.setSession(session), this.$markerBack.setSession(session), this.$markerFront.setSession(session), this.$gutterLayer.setSession(session), this.$textLayer.setSession(session), session && (this.$loop.schedule(this.CHANGE_FULL), this.session.$setFontMetrics(this.$fontMetrics), this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null, this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this), this.onChangeNewLineMode(), this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode));
                    }, this.updateLines = function(firstRow, lastRow, force) {
                        if (void 0 === lastRow && (lastRow = 1 / 0), this.$changedLines ? (this.$changedLines.firstRow > firstRow && (this.$changedLines.firstRow = firstRow), this.$changedLines.lastRow < lastRow && (this.$changedLines.lastRow = lastRow)) : this.$changedLines = {
                            firstRow: firstRow,
                            lastRow: lastRow
                        }, this.$changedLines.lastRow < this.layerConfig.firstRow) {
                            if (!force) return;
                            this.$changedLines.lastRow = this.layerConfig.lastRow;
                        }
                        this.$changedLines.firstRow > this.layerConfig.lastRow || this.$loop.schedule(this.CHANGE_LINES);
                    }, this.onChangeNewLineMode = function() {
                        this.$loop.schedule(this.CHANGE_TEXT), this.$textLayer.$updateEolChar(), this.session.$bidiHandler.setEolChar(this.$textLayer.EOL_CHAR);
                    }, this.onChangeTabSize = function() {
                        this.$loop.schedule(this.CHANGE_TEXT | this.CHANGE_MARKER), this.$textLayer.onChangeTabSize();
                    }, this.updateText = function() {
                        this.$loop.schedule(this.CHANGE_TEXT);
                    }, this.updateFull = function(force) {
                        force ? this.$renderChanges(this.CHANGE_FULL, !0) : this.$loop.schedule(this.CHANGE_FULL);
                    }, this.updateFontSize = function() {
                        this.$textLayer.checkForSizeChanges();
                    }, this.$changes = 0, this.$updateSizeAsync = function() {
                        this.$loop.pending ? this.$size.$dirty = !0 : this.onResize();
                    }, this.onResize = function(force, gutterWidth, width, height) {
                        if (!(this.resizing > 2)) {
                            this.resizing > 0 ? this.resizing++ : this.resizing = force ? 1 : 0;
                            var el = this.container;
                            height || (height = el.clientHeight || el.scrollHeight), width || (width = el.clientWidth || el.scrollWidth);
                            var changes = this.$updateCachedSize(force, gutterWidth, width, height);
                            if (!this.$size.scrollerHeight || !width && !height) return this.resizing = 0;
                            force && (this.$gutterLayer.$padding = null), force ? this.$renderChanges(changes | this.$changes, !0) : this.$loop.schedule(changes | this.$changes), this.resizing && (this.resizing = 0), this.scrollBarH.scrollLeft = this.scrollBarV.scrollTop = null;
                        }
                    }, this.$updateCachedSize = function(force, gutterWidth, width, height) {
                        height -= this.$extraHeight || 0;
                        var changes = 0, size = this.$size, oldSize = {
                            width: size.width,
                            height: size.height,
                            scrollerHeight: size.scrollerHeight,
                            scrollerWidth: size.scrollerWidth
                        };
                        if (height && (force || size.height != height) && (size.height = height, changes |= this.CHANGE_SIZE, size.scrollerHeight = size.height, this.$horizScroll && (size.scrollerHeight -= this.scrollBarH.getHeight()), this.scrollBarV.element.style.bottom = this.scrollBarH.getHeight() + "px", changes |= this.CHANGE_SCROLL), width && (force || size.width != width)) {
                            changes |= this.CHANGE_SIZE, size.width = width, null == gutterWidth && (gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0), this.gutterWidth = gutterWidth, dom.setStyle(this.scrollBarH.element.style, "left", gutterWidth + "px"), dom.setStyle(this.scroller.style, "left", gutterWidth + this.margin.left + "px"), size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.getWidth() - this.margin.h), dom.setStyle(this.$gutter.style, "left", this.margin.left + "px");
                            var right = this.scrollBarV.getWidth() + "px";
                            dom.setStyle(this.scrollBarH.element.style, "right", right), dom.setStyle(this.scroller.style, "right", right), dom.setStyle(this.scroller.style, "bottom", this.scrollBarH.getHeight()), (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force) && (changes |= this.CHANGE_FULL);
                        }
                        return size.$dirty = !width || !height, changes && this._signal("resize", oldSize), changes;
                    }, this.onGutterResize = function(width) {
                        var gutterWidth = this.$showGutter ? width : 0;
                        gutterWidth != this.gutterWidth && (this.$changes |= this.$updateCachedSize(!0, gutterWidth, this.$size.width, this.$size.height)), this.session.getUseWrapMode() && this.adjustWrapLimit() ? this.$loop.schedule(this.CHANGE_FULL) : this.$size.$dirty ? this.$loop.schedule(this.CHANGE_FULL) : this.$computeLayerConfig();
                    }, this.adjustWrapLimit = function() {
                        var limit = Math.floor((this.$size.scrollerWidth - 2 * this.$padding) / this.characterWidth);
                        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
                    }, this.setAnimatedScroll = function(shouldAnimate) {
                        this.setOption("animatedScroll", shouldAnimate);
                    }, this.getAnimatedScroll = function() {
                        return this.$animatedScroll;
                    }, this.setShowInvisibles = function(showInvisibles) {
                        this.setOption("showInvisibles", showInvisibles), this.session.$bidiHandler.setShowInvisibles(showInvisibles);
                    }, this.getShowInvisibles = function() {
                        return this.getOption("showInvisibles");
                    }, this.getDisplayIndentGuides = function() {
                        return this.getOption("displayIndentGuides");
                    }, this.setDisplayIndentGuides = function(display) {
                        this.setOption("displayIndentGuides", display);
                    }, this.setShowPrintMargin = function(showPrintMargin) {
                        this.setOption("showPrintMargin", showPrintMargin);
                    }, this.getShowPrintMargin = function() {
                        return this.getOption("showPrintMargin");
                    }, this.setPrintMarginColumn = function(showPrintMargin) {
                        this.setOption("printMarginColumn", showPrintMargin);
                    }, this.getPrintMarginColumn = function() {
                        return this.getOption("printMarginColumn");
                    }, this.getShowGutter = function() {
                        return this.getOption("showGutter");
                    }, this.setShowGutter = function(show) {
                        return this.setOption("showGutter", show);
                    }, this.getFadeFoldWidgets = function() {
                        return this.getOption("fadeFoldWidgets");
                    }, this.setFadeFoldWidgets = function(show) {
                        this.setOption("fadeFoldWidgets", show);
                    }, this.setHighlightGutterLine = function(shouldHighlight) {
                        this.setOption("highlightGutterLine", shouldHighlight);
                    }, this.getHighlightGutterLine = function() {
                        return this.getOption("highlightGutterLine");
                    }, this.$updatePrintMargin = function() {
                        if (this.$showPrintMargin || this.$printMarginEl) {
                            if (!this.$printMarginEl) {
                                var containerEl = dom.createElement("div");
                                containerEl.className = "ace_layer ace_print-margin-layer", this.$printMarginEl = dom.createElement("div"), this.$printMarginEl.className = "ace_print-margin", containerEl.appendChild(this.$printMarginEl), this.content.insertBefore(containerEl, this.content.firstChild);
                            }
                            var style = this.$printMarginEl.style;
                            style.left = Math.round(this.characterWidth * this.$printMarginColumn + this.$padding) + "px", style.visibility = this.$showPrintMargin ? "visible" : "hidden", this.session && -1 == this.session.$wrap && this.adjustWrapLimit();
                        }
                    }, this.getContainerElement = function() {
                        return this.container;
                    }, this.getMouseEventTarget = function() {
                        return this.scroller;
                    }, this.getTextAreaContainer = function() {
                        return this.container;
                    }, this.$moveTextAreaToCursor = function() {
                        if (!this.$isMousePressed) {
                            var style = this.textarea.style, composition = this.$composition;
                            if (!this.$keepTextAreaAtCursor && !composition) {
                                dom.translate(this.textarea, -100, 0);
                                return;
                            }
                            var pixelPos = this.$cursorLayer.$pixelPos;
                            if (pixelPos) {
                                composition && composition.markerRange && (pixelPos = this.$cursorLayer.getPixelPosition(composition.markerRange.start, !0));
                                var config = this.layerConfig, posTop = pixelPos.top, posLeft = pixelPos.left;
                                posTop -= config.offset;
                                var h = composition && composition.useTextareaForIME ? this.lineHeight : HIDE_TEXTAREA ? 0 : 1;
                                if (posTop < 0 || posTop > config.height - h) {
                                    dom.translate(this.textarea, 0, 0);
                                    return;
                                }
                                var w = 1, maxTop = this.$size.height - h;
                                if (composition) {
                                    if (composition.useTextareaForIME) {
                                        var val = this.textarea.value;
                                        w = this.characterWidth * this.session.$getStringScreenWidth(val)[0];
                                    } else posTop += this.lineHeight + 2;
                                } else posTop += this.lineHeight;
                                (posLeft -= this.scrollLeft) > this.$size.scrollerWidth - w && (posLeft = this.$size.scrollerWidth - w), posLeft += this.gutterWidth + this.margin.left, dom.setStyle(style, "height", h + "px"), dom.setStyle(style, "width", w + "px"), dom.translate(this.textarea, Math.min(posLeft, this.$size.scrollerWidth - w), Math.min(posTop, maxTop));
                            }
                        }
                    }, this.getFirstVisibleRow = function() {
                        return this.layerConfig.firstRow;
                    }, this.getFirstFullyVisibleRow = function() {
                        return this.layerConfig.firstRow + (0 === this.layerConfig.offset ? 0 : 1);
                    }, this.getLastFullyVisibleRow = function() {
                        var config = this.layerConfig, lastRow = config.lastRow;
                        return this.session.documentToScreenRow(lastRow, 0) * config.lineHeight - this.session.getScrollTop() > config.height - config.lineHeight ? lastRow - 1 : lastRow;
                    }, this.getLastVisibleRow = function() {
                        return this.layerConfig.lastRow;
                    }, this.$padding = null, this.setPadding = function(padding) {
                        this.$padding = padding, this.$textLayer.setPadding(padding), this.$cursorLayer.setPadding(padding), this.$markerFront.setPadding(padding), this.$markerBack.setPadding(padding), this.$loop.schedule(this.CHANGE_FULL), this.$updatePrintMargin();
                    }, this.setScrollMargin = function(top, bottom, left, right) {
                        var sm = this.scrollMargin;
                        sm.top = 0 | top, sm.bottom = 0 | bottom, sm.right = 0 | right, sm.left = 0 | left, sm.v = sm.top + sm.bottom, sm.h = sm.left + sm.right, sm.top && this.scrollTop <= 0 && this.session && this.session.setScrollTop(-sm.top), this.updateFull();
                    }, this.setMargin = function(top, bottom, left, right) {
                        var sm = this.margin;
                        sm.top = 0 | top, sm.bottom = 0 | bottom, sm.right = 0 | right, sm.left = 0 | left, sm.v = sm.top + sm.bottom, sm.h = sm.left + sm.right, this.$updateCachedSize(!0, this.gutterWidth, this.$size.width, this.$size.height), this.updateFull();
                    }, this.getHScrollBarAlwaysVisible = function() {
                        return this.$hScrollBarAlwaysVisible;
                    }, this.setHScrollBarAlwaysVisible = function(alwaysVisible) {
                        this.setOption("hScrollBarAlwaysVisible", alwaysVisible);
                    }, this.getVScrollBarAlwaysVisible = function() {
                        return this.$vScrollBarAlwaysVisible;
                    }, this.setVScrollBarAlwaysVisible = function(alwaysVisible) {
                        this.setOption("vScrollBarAlwaysVisible", alwaysVisible);
                    }, this.$updateScrollBarV = function() {
                        var scrollHeight = this.layerConfig.maxHeight, scrollerHeight = this.$size.scrollerHeight;
                        !this.$maxLines && this.$scrollPastEnd && (scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd, this.scrollTop > scrollHeight - scrollerHeight && (scrollHeight = this.scrollTop + scrollerHeight, this.scrollBarV.scrollTop = null)), this.scrollBarV.setScrollHeight(scrollHeight + this.scrollMargin.v), this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
                    }, this.$updateScrollBarH = function() {
                        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h), this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
                    }, this.$frozen = !1, this.freeze = function() {
                        this.$frozen = !0;
                    }, this.unfreeze = function() {
                        this.$frozen = !1;
                    }, this.$renderChanges = function(changes, force) {
                        if (this.$changes && (changes |= this.$changes, this.$changes = 0), !this.session || !this.container.offsetWidth || this.$frozen || !changes && !force) {
                            this.$changes |= changes;
                            return;
                        }
                        if (this.$size.$dirty) return this.$changes |= changes, this.onResize(!0);
                        this.lineHeight || this.$textLayer.checkForSizeChanges(), this._signal("beforeRender", changes), this.session && this.session.$bidiHandler && this.session.$bidiHandler.updateCharacterWidths(this.$fontMetrics);
                        var config = this.layerConfig;
                        if (changes & this.CHANGE_FULL || changes & this.CHANGE_SIZE || changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES || changes & this.CHANGE_SCROLL || changes & this.CHANGE_H_SCROLL) {
                            if (changes |= this.$computeLayerConfig() | this.$loop.clear(), config.firstRow != this.layerConfig.firstRow && config.firstRowScreen == this.layerConfig.firstRowScreen) {
                                var st = this.scrollTop + (config.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                                st > 0 && (this.scrollTop = st, changes |= this.CHANGE_SCROLL, changes |= this.$computeLayerConfig() | this.$loop.clear());
                            }
                            config = this.layerConfig, this.$updateScrollBarV(), changes & this.CHANGE_H_SCROLL && this.$updateScrollBarH(), dom.translate(this.content, -this.scrollLeft, -config.offset);
                            var width = config.width + 2 * this.$padding + "px", height = config.minHeight + "px";
                            dom.setStyle(this.content.style, "width", width), dom.setStyle(this.content.style, "height", height);
                        }
                        if (changes & this.CHANGE_H_SCROLL && (dom.translate(this.content, -this.scrollLeft, -config.offset), this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left"), changes & this.CHANGE_FULL) {
                            this.$changedLines = null, this.$textLayer.update(config), this.$showGutter && this.$gutterLayer.update(config), this.$markerBack.update(config), this.$markerFront.update(config), this.$cursorLayer.update(config), this.$moveTextAreaToCursor(), this._signal("afterRender", changes);
                            return;
                        }
                        if (changes & this.CHANGE_SCROLL) {
                            this.$changedLines = null, changes & this.CHANGE_TEXT || changes & this.CHANGE_LINES ? this.$textLayer.update(config) : this.$textLayer.scrollLines(config), this.$showGutter && (changes & this.CHANGE_GUTTER || changes & this.CHANGE_LINES ? this.$gutterLayer.update(config) : this.$gutterLayer.scrollLines(config)), this.$markerBack.update(config), this.$markerFront.update(config), this.$cursorLayer.update(config), this.$moveTextAreaToCursor(), this._signal("afterRender", changes);
                            return;
                        }
                        changes & this.CHANGE_TEXT ? (this.$changedLines = null, this.$textLayer.update(config), this.$showGutter && this.$gutterLayer.update(config)) : changes & this.CHANGE_LINES ? (this.$updateLines() || changes & this.CHANGE_GUTTER && this.$showGutter) && this.$gutterLayer.update(config) : changes & this.CHANGE_TEXT || changes & this.CHANGE_GUTTER ? this.$showGutter && this.$gutterLayer.update(config) : changes & this.CHANGE_CURSOR && this.$highlightGutterLine && this.$gutterLayer.updateLineHighlight(config), changes & this.CHANGE_CURSOR && (this.$cursorLayer.update(config), this.$moveTextAreaToCursor()), changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_FRONT) && this.$markerFront.update(config), changes & (this.CHANGE_MARKER | this.CHANGE_MARKER_BACK) && this.$markerBack.update(config), this._signal("afterRender", changes);
                    }, this.$autosize = function() {
                        var height = this.session.getScreenLength() * this.lineHeight, maxHeight = this.$maxLines * this.lineHeight, desiredHeight = Math.min(maxHeight, Math.max((this.$minLines || 1) * this.lineHeight, height)) + this.scrollMargin.v + (this.$extraHeight || 0);
                        this.$horizScroll && (desiredHeight += this.scrollBarH.getHeight()), this.$maxPixelHeight && desiredHeight > this.$maxPixelHeight && (desiredHeight = this.$maxPixelHeight);
                        var vScroll = !(desiredHeight <= 2 * this.lineHeight) && height > maxHeight;
                        if (desiredHeight != this.desiredHeight || this.$size.height != this.desiredHeight || vScroll != this.$vScroll) {
                            vScroll != this.$vScroll && (this.$vScroll = vScroll, this.scrollBarV.setVisible(vScroll));
                            var w = this.container.clientWidth;
                            this.container.style.height = desiredHeight + "px", this.$updateCachedSize(!0, this.$gutterWidth, w, desiredHeight), this.desiredHeight = desiredHeight, this._signal("autosize");
                        }
                    }, this.$computeLayerConfig = function() {
                        var firstRowScreen, firstRowHeight, session = this.session, size = this.$size, hideScrollbars = size.height <= 2 * this.lineHeight, maxHeight = this.session.getScreenLength() * this.lineHeight, longestLine = this.$getLongestLine(), horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible || size.scrollerWidth - longestLine - 2 * this.$padding < 0), hScrollChanged = this.$horizScroll !== horizScroll;
                        hScrollChanged && (this.$horizScroll = horizScroll, this.scrollBarH.setVisible(horizScroll));
                        var vScrollBefore = this.$vScroll; // autosize can change vscroll value in which case we need to update longestLine
                        this.$maxLines && this.lineHeight > 1 && this.$autosize();
                        var minHeight = size.scrollerHeight + this.lineHeight, scrollPastEnd = !this.$maxLines && this.$scrollPastEnd ? (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd : 0;
                        maxHeight += scrollPastEnd;
                        var sm = this.scrollMargin;
                        this.session.setScrollTop(Math.max(-sm.top, Math.min(this.scrollTop, maxHeight - size.scrollerHeight + sm.bottom))), this.session.setScrollLeft(Math.max(-sm.left, Math.min(this.scrollLeft, longestLine + 2 * this.$padding - size.scrollerWidth + sm.right)));
                        var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible || size.scrollerHeight - maxHeight + scrollPastEnd < 0 || this.scrollTop > sm.top), vScrollChanged = vScrollBefore !== vScroll;
                        vScrollChanged && (this.$vScroll = vScroll, this.scrollBarV.setVisible(vScroll));
                        var offset = this.scrollTop % this.lineHeight, lineCount = Math.ceil(minHeight / this.lineHeight) - 1, firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight)), lastRow = firstRow + lineCount, lineHeight = this.lineHeight;
                        firstRow = session.screenToDocumentRow(firstRow, 0);
                        var foldLine = session.getFoldLine(firstRow);
                        foldLine && (firstRow = foldLine.start.row), firstRowScreen = session.documentToScreenRow(firstRow, 0), firstRowHeight = session.getRowLength(firstRow) * lineHeight, lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1), minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight + firstRowHeight, offset = this.scrollTop - firstRowScreen * lineHeight;
                        var changes = 0;
                        return (this.layerConfig.width != longestLine || hScrollChanged) && (changes = this.CHANGE_H_SCROLL), (hScrollChanged || vScrollChanged) && (changes |= this.$updateCachedSize(!0, this.gutterWidth, size.width, size.height), this._signal("scrollbarVisibilityChanged"), vScrollChanged && (longestLine = this.$getLongestLine())), this.layerConfig = {
                            width: longestLine,
                            padding: this.$padding,
                            firstRow: firstRow,
                            firstRowScreen: firstRowScreen,
                            lastRow: lastRow,
                            lineHeight: lineHeight,
                            characterWidth: this.characterWidth,
                            minHeight: minHeight,
                            maxHeight: maxHeight,
                            offset: offset,
                            gutterOffset: lineHeight ? Math.max(0, Math.ceil((offset + size.height - size.scrollerHeight) / lineHeight)) : 0,
                            height: this.$size.scrollerHeight
                        }, this.session.$bidiHandler && this.session.$bidiHandler.setContentWidth(longestLine - this.$padding), changes;
                    }, this.$updateLines = function() {
                        if (this.$changedLines) {
                            var firstRow = this.$changedLines.firstRow, lastRow = this.$changedLines.lastRow;
                            this.$changedLines = null;
                            var layerConfig = this.layerConfig;
                            if (!(firstRow > layerConfig.lastRow + 1) && !(lastRow < layerConfig.firstRow)) {
                                if (lastRow === 1 / 0) {
                                    this.$showGutter && this.$gutterLayer.update(layerConfig), this.$textLayer.update(layerConfig);
                                    return;
                                }
                                return this.$textLayer.updateLines(layerConfig, firstRow, lastRow), !0;
                            }
                        }
                    }, this.$getLongestLine = function() {
                        var charCount = this.session.getScreenWidth();
                        return this.showInvisibles && !this.session.$useWrapMode && (charCount += 1), this.$textLayer && charCount > this.$textLayer.MAX_LINE_LENGTH && (charCount = this.$textLayer.MAX_LINE_LENGTH + 30), Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
                    }, this.updateFrontMarkers = function() {
                        this.$markerFront.setMarkers(this.session.getMarkers(!0)), this.$loop.schedule(this.CHANGE_MARKER_FRONT);
                    }, this.updateBackMarkers = function() {
                        this.$markerBack.setMarkers(this.session.getMarkers()), this.$loop.schedule(this.CHANGE_MARKER_BACK);
                    }, this.addGutterDecoration = function(row, className) {
                        this.$gutterLayer.addGutterDecoration(row, className);
                    }, this.removeGutterDecoration = function(row, className) {
                        this.$gutterLayer.removeGutterDecoration(row, className);
                    }, this.updateBreakpoints = function(rows) {
                        this.$loop.schedule(this.CHANGE_GUTTER);
                    }, this.setAnnotations = function(annotations) {
                        this.$gutterLayer.setAnnotations(annotations), this.$loop.schedule(this.CHANGE_GUTTER);
                    }, this.updateCursor = function() {
                        this.$loop.schedule(this.CHANGE_CURSOR);
                    }, this.hideCursor = function() {
                        this.$cursorLayer.hideCursor();
                    }, this.showCursor = function() {
                        this.$cursorLayer.showCursor();
                    }, this.scrollSelectionIntoView = function(anchor, lead, offset) {
                        this.scrollCursorIntoView(anchor, offset), this.scrollCursorIntoView(lead, offset);
                    }, this.scrollCursorIntoView = function(cursor, offset, $viewMargin) {
                        if (0 !== this.$size.scrollerHeight) {
                            var pos = this.$cursorLayer.getPixelPosition(cursor), left = pos.left, top = pos.top, topMargin = $viewMargin && $viewMargin.top || 0, bottomMargin = $viewMargin && $viewMargin.bottom || 0, scrollTop = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;
                            scrollTop + topMargin > top ? (offset && scrollTop + topMargin > top + this.lineHeight && (top -= offset * this.$size.scrollerHeight), 0 === top && (top = -this.scrollMargin.top), this.session.setScrollTop(top)) : scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight && (offset && scrollTop + this.$size.scrollerHeight - bottomMargin < top - this.lineHeight && (top += offset * this.$size.scrollerHeight), this.session.setScrollTop(top + this.lineHeight + bottomMargin - this.$size.scrollerHeight));
                            var scrollLeft = this.scrollLeft;
                            scrollLeft > left ? (left < this.$padding + 2 * this.layerConfig.characterWidth && (left = -this.scrollMargin.left), this.session.setScrollLeft(left)) : scrollLeft + this.$size.scrollerWidth < left + this.characterWidth ? this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth)) : scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth && this.session.setScrollLeft(0);
                        }
                    }, this.getScrollTop = function() {
                        return this.session.getScrollTop();
                    }, this.getScrollLeft = function() {
                        return this.session.getScrollLeft();
                    }, this.getScrollTopRow = function() {
                        return this.scrollTop / this.lineHeight;
                    }, this.getScrollBottomRow = function() {
                        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
                    }, this.scrollToRow = function(row) {
                        this.session.setScrollTop(row * this.lineHeight);
                    }, this.alignCursor = function(cursor, alignment) {
                        "number" == typeof cursor && (cursor = {
                            row: cursor,
                            column: 0
                        });
                        var pos = this.$cursorLayer.getPixelPosition(cursor), h = this.$size.scrollerHeight - this.lineHeight, offset = pos.top - h * (alignment || 0);
                        return this.session.setScrollTop(offset), offset;
                    }, this.STEPS = 8, this.$calcSteps = function(fromValue, toValue) {
                        var i = 0, l = this.STEPS, steps = [];
                        for(i = 0; i < l; ++i)steps.push((toValue - fromValue) * (Math.pow(i / this.STEPS - 1, 3) + 1) + fromValue);
                        return steps;
                    }, this.scrollToLine = function(line, center, animate, callback) {
                        var offset = this.$cursorLayer.getPixelPosition({
                            row: line,
                            column: 0
                        }).top;
                        center && (offset -= this.$size.scrollerHeight / 2);
                        var initialScroll = this.scrollTop;
                        this.session.setScrollTop(offset), !1 !== animate && this.animateScrolling(initialScroll, callback);
                    }, this.animateScrolling = function(fromValue, callback) {
                        var toValue = this.scrollTop;
                        if (this.$animatedScroll) {
                            var _self = this;
                            if (fromValue != toValue) {
                                if (this.$scrollAnimation) {
                                    var oldSteps = this.$scrollAnimation.steps;
                                    if (oldSteps.length && (fromValue = oldSteps[0]) == toValue) return;
                                }
                                var steps = _self.$calcSteps(fromValue, toValue);
                                this.$scrollAnimation = {
                                    from: fromValue,
                                    to: toValue,
                                    steps: steps
                                }, clearInterval(this.$timer), _self.session.setScrollTop(steps.shift()), _self.session.$scrollTop = toValue, this.$timer = setInterval(function() {
                                    if (!_self.session) return clearInterval(_self.$timer);
                                    steps.length ? (_self.session.setScrollTop(steps.shift()), _self.session.$scrollTop = toValue) : null != toValue ? (_self.session.$scrollTop = -1, _self.session.setScrollTop(toValue), toValue = null) : (_self.$timer = clearInterval(_self.$timer), _self.$scrollAnimation = null, callback && callback());
                                }, 10);
                            }
                        }
                    }, this.scrollToY = function(scrollTop) {
                        this.scrollTop !== scrollTop && (this.$loop.schedule(this.CHANGE_SCROLL), this.scrollTop = scrollTop);
                    }, this.scrollToX = function(scrollLeft) {
                        this.scrollLeft !== scrollLeft && (this.scrollLeft = scrollLeft), this.$loop.schedule(this.CHANGE_H_SCROLL);
                    }, this.scrollTo = function(x, y) {
                        this.session.setScrollTop(y), this.session.setScrollLeft(x);
                    }, this.scrollBy = function(deltaX, deltaY) {
                        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY), deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
                    }, this.isScrollableBy = function(deltaX, deltaY) {
                        if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top || deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom || deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left || deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth - this.layerConfig.width < -1 + this.scrollMargin.right) return !0;
                    }, this.pixelToScreenCoordinates = function(x, y) {
                        if (this.$hasCssTransforms) {
                            canvasPos = {
                                top: 0,
                                left: 0
                            };
                            var canvasPos, p = this.$fontMetrics.transformCoordinates([
                                x,
                                y
                            ]);
                            x = p[1] - this.gutterWidth - this.margin.left, y = p[0];
                        } else canvasPos = this.scroller.getBoundingClientRect();
                        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding, offset = offsetX / this.characterWidth, row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight), col = this.$blockCursor ? Math.floor(offset) : Math.round(offset);
                        return {
                            row: row,
                            column: col,
                            side: offset - col > 0 ? 1 : -1,
                            offsetX: offsetX
                        };
                    }, this.screenToTextCoordinates = function(x, y) {
                        if (this.$hasCssTransforms) {
                            canvasPos = {
                                top: 0,
                                left: 0
                            };
                            var canvasPos, p = this.$fontMetrics.transformCoordinates([
                                x,
                                y
                            ]);
                            x = p[1] - this.gutterWidth - this.margin.left, y = p[0];
                        } else canvasPos = this.scroller.getBoundingClientRect();
                        var offsetX = x + this.scrollLeft - canvasPos.left - this.$padding, offset = offsetX / this.characterWidth, col = this.$blockCursor ? Math.floor(offset) : Math.round(offset), row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
                        return this.session.screenToDocumentPosition(row, Math.max(col, 0), offsetX);
                    }, this.textToScreenCoordinates = function(row, column) {
                        var canvasPos = this.scroller.getBoundingClientRect(), pos = this.session.documentToScreenPosition(row, column), x = this.$padding + (this.session.$bidiHandler.isBidiRow(pos.row, row) ? this.session.$bidiHandler.getPosLeft(pos.column) : Math.round(pos.column * this.characterWidth)), y = pos.row * this.lineHeight;
                        return {
                            pageX: canvasPos.left + x - this.scrollLeft,
                            pageY: canvasPos.top + y - this.scrollTop
                        };
                    }, this.visualizeFocus = function() {
                        dom.addCssClass(this.container, "ace_focus");
                    }, this.visualizeBlur = function() {
                        dom.removeCssClass(this.container, "ace_focus");
                    }, this.showComposition = function(composition) {
                        this.$composition = composition, composition.cssText || (composition.cssText = this.textarea.style.cssText), void 0 == composition.useTextareaForIME && (composition.useTextareaForIME = this.$useTextareaForIME), this.$useTextareaForIME ? (dom.addCssClass(this.textarea, "ace_composition"), this.textarea.style.cssText = "", this.$moveTextAreaToCursor(), this.$cursorLayer.element.style.display = "none") : composition.markerId = this.session.addMarker(composition.markerRange, "ace_composition_marker", "text");
                    }, this.setCompositionText = function(text) {
                        var cursor = this.session.selection.cursor;
                        this.addToken(text, "composition_placeholder", cursor.row, cursor.column), this.$moveTextAreaToCursor();
                    }, this.hideComposition = function() {
                        if (this.$composition) {
                            this.$composition.markerId && this.session.removeMarker(this.$composition.markerId), dom.removeCssClass(this.textarea, "ace_composition"), this.textarea.style.cssText = this.$composition.cssText;
                            var cursor = this.session.selection.cursor;
                            this.removeExtraToken(cursor.row, cursor.column), this.$composition = null, this.$cursorLayer.element.style.display = "";
                        }
                    }, this.addToken = function(text, type, row, column) {
                        var session = this.session;
                        session.bgTokenizer.lines[row] = null;
                        var newToken = {
                            type: type,
                            value: text
                        }, tokens = session.getTokens(row);
                        if (null == column) tokens.push(newToken);
                        else for(var l = 0, i = 0; i < tokens.length; i++){
                            var token = tokens[i];
                            if (column <= (l += token.value.length)) {
                                var diff = token.value.length - (l - column), before = token.value.slice(0, diff), after = token.value.slice(diff);
                                tokens.splice(i, 1, {
                                    type: token.type,
                                    value: before
                                }, newToken, {
                                    type: token.type,
                                    value: after
                                });
                                break;
                            }
                        }
                        this.updateLines(row, row);
                    }, this.removeExtraToken = function(row, column) {
                        this.updateLines(row, row);
                    }, this.setTheme = function(theme, cb) {
                        var _self = this;
                        if (this.$themeId = theme, _self._dispatchEvent("themeChange", {
                            theme: theme
                        }), theme && "string" != typeof theme) afterLoad(theme);
                        else {
                            var moduleName = theme || this.$options.theme.initialValue;
                            config.loadModule([
                                "theme",
                                moduleName
                            ], afterLoad);
                        }
                        function afterLoad(module) {
                            if (_self.$themeId != theme) return cb && cb();
                            if (!module || !module.cssClass) throw Error("couldn't load module " + theme + " or it didn't call define");
                            module.$id && (_self.$themeId = module.$id), dom.importCssString(module.cssText, module.cssClass, _self.container), _self.theme && dom.removeCssClass(_self.container, _self.theme.cssClass);
                            var padding = "padding" in module ? module.padding : "padding" in (_self.theme || {}) ? 4 : _self.$padding;
                            _self.$padding && padding != _self.$padding && _self.setPadding(padding), _self.$theme = module.cssClass, _self.theme = module, dom.addCssClass(_self.container, module.cssClass), dom.setCssClass(_self.container, "ace_dark", module.isDark), _self.$size && (_self.$size.width = 0, _self.$updateSizeAsync()), _self._dispatchEvent("themeLoaded", {
                                theme: module
                            }), cb && cb();
                        }
                    }, this.getTheme = function() {
                        return this.$themeId;
                    }, this.setStyle = function(style, include) {
                        dom.setCssClass(this.container, style, !1 !== include);
                    }, this.unsetStyle = function(style) {
                        dom.removeCssClass(this.container, style);
                    }, this.setCursorStyle = function(style) {
                        dom.setStyle(this.scroller.style, "cursor", style);
                    }, this.setMouseCursor = function(cursorStyle) {
                        dom.setStyle(this.scroller.style, "cursor", cursorStyle);
                    }, this.attachToShadowRoot = function() {
                        dom.importCssString(editorCss, "ace_editor.css", this.container);
                    }, this.destroy = function() {
                        this.freeze(), this.$fontMetrics.destroy(), this.$cursorLayer.destroy(), this.removeAllListeners(), this.container.textContent = "";
                    };
                }).call(VirtualRenderer.prototype), config.defineOptions(VirtualRenderer.prototype, "renderer", {
                    animatedScroll: {
                        initialValue: !1
                    },
                    showInvisibles: {
                        set: function(value) {
                            this.$textLayer.setShowInvisibles(value) && this.$loop.schedule(this.CHANGE_TEXT);
                        },
                        initialValue: !1
                    },
                    showPrintMargin: {
                        set: function() {
                            this.$updatePrintMargin();
                        },
                        initialValue: !0
                    },
                    printMarginColumn: {
                        set: function() {
                            this.$updatePrintMargin();
                        },
                        initialValue: 80
                    },
                    printMargin: {
                        set: function(val) {
                            "number" == typeof val && (this.$printMarginColumn = val), this.$showPrintMargin = !!val, this.$updatePrintMargin();
                        },
                        get: function() {
                            return this.$showPrintMargin && this.$printMarginColumn;
                        }
                    },
                    showGutter: {
                        set: function(show) {
                            this.$gutter.style.display = show ? "block" : "none", this.$loop.schedule(this.CHANGE_FULL), this.onGutterResize();
                        },
                        initialValue: !0
                    },
                    fadeFoldWidgets: {
                        set: function(show) {
                            dom.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
                        },
                        initialValue: !1
                    },
                    showFoldWidgets: {
                        set: function(show) {
                            this.$gutterLayer.setShowFoldWidgets(show), this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: !0
                    },
                    displayIndentGuides: {
                        set: function(show) {
                            this.$textLayer.setDisplayIndentGuides(show) && this.$loop.schedule(this.CHANGE_TEXT);
                        },
                        initialValue: !0
                    },
                    highlightGutterLine: {
                        set: function(shouldHighlight) {
                            this.$gutterLayer.setHighlightGutterLine(shouldHighlight), this.$loop.schedule(this.CHANGE_GUTTER);
                        },
                        initialValue: !0
                    },
                    hScrollBarAlwaysVisible: {
                        set: function(val) {
                            this.$hScrollBarAlwaysVisible && this.$horizScroll || this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: !1
                    },
                    vScrollBarAlwaysVisible: {
                        set: function(val) {
                            this.$vScrollBarAlwaysVisible && this.$vScroll || this.$loop.schedule(this.CHANGE_SCROLL);
                        },
                        initialValue: !1
                    },
                    fontSize: {
                        set: function(size) {
                            "number" == typeof size && (size += "px"), this.container.style.fontSize = size, this.updateFontSize();
                        },
                        initialValue: 12
                    },
                    fontFamily: {
                        set: function(name) {
                            this.container.style.fontFamily = name, this.updateFontSize();
                        }
                    },
                    maxLines: {
                        set: function(val) {
                            this.updateFull();
                        }
                    },
                    minLines: {
                        set: function(val) {
                            this.$minLines < 0x1ffffffffffff || (this.$minLines = 0), this.updateFull();
                        }
                    },
                    maxPixelHeight: {
                        set: function(val) {
                            this.updateFull();
                        },
                        initialValue: 0
                    },
                    scrollPastEnd: {
                        set: function(val) {
                            val = +val || 0, this.$scrollPastEnd != val && (this.$scrollPastEnd = val, this.$loop.schedule(this.CHANGE_SCROLL));
                        },
                        initialValue: 0,
                        handlesSet: !0
                    },
                    fixedWidthGutter: {
                        set: function(val) {
                            this.$gutterLayer.$fixedWidth = !!val, this.$loop.schedule(this.CHANGE_GUTTER);
                        }
                    },
                    theme: {
                        set: function(val) {
                            this.setTheme(val);
                        },
                        get: function() {
                            return this.$themeId || this.theme;
                        },
                        initialValue: "./theme/textmate",
                        handlesSet: !0
                    },
                    hasCssTransforms: {},
                    useTextareaForIME: {
                        initialValue: !useragent.isMobile && !useragent.isIE
                    }
                }), exports.VirtualRenderer = VirtualRenderer;
            }), ace.define("ace/worker/worker_client", [
                "require",
                "exports",
                "module",
                "ace/lib/oop",
                "ace/lib/net",
                "ace/lib/event_emitter",
                "ace/config"
            ], function(require, exports, module) {
                "use strict";
                var oop = require("../lib/oop"), net = require("../lib/net"), EventEmitter = require("../lib/event_emitter").EventEmitter, config = require("../config");
                function createWorker(workerUrl) {
                    if ("undefined" == typeof Worker) return {
                        postMessage: function() {},
                        terminate: function() {}
                    };
                    if (config.get("loadWorkerFromBlob")) {
                        var blob = function(workerUrl) {
                            var script = "importScripts('" + net.qualifyURL(workerUrl) + "');";
                            try {
                                return new Blob([
                                    script
                                ], {
                                    type: "application/javascript"
                                });
                            } catch (e) {
                                var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                                return blobBuilder.append(script), blobBuilder.getBlob("application/javascript");
                            }
                        }(workerUrl);
                        return new Worker((window.URL || window.webkitURL).createObjectURL(blob));
                    }
                    return new Worker(workerUrl);
                }
                var WorkerClient = function(worker) {
                    worker.postMessage || (worker = this.$createWorkerFromOldConfig.apply(this, arguments)), this.$worker = worker, this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this), this.changeListener = this.changeListener.bind(this), this.onMessage = this.onMessage.bind(this), this.callbackId = 1, this.callbacks = {}, this.$worker.onmessage = this.onMessage;
                };
                (function() {
                    oop.implement(this, EventEmitter), this.$createWorkerFromOldConfig = function(topLevelNamespaces, mod, classname, workerUrl, importScripts) {
                        if (require.nameToUrl && !require.toUrl && (require.toUrl = require.nameToUrl), config.get("packaged") || !require.toUrl) workerUrl = workerUrl || config.moduleUrl(mod, "worker");
                        else {
                            var normalizePath = this.$normalizePath;
                            workerUrl = workerUrl || normalizePath(require.toUrl("ace/worker/worker.js", null, "_"));
                            var tlns = {};
                            topLevelNamespaces.forEach(function(ns) {
                                tlns[ns] = normalizePath(require.toUrl(ns, null, "_").replace(/(\.js)?(\?.*)?$/, ""));
                            });
                        }
                        return this.$worker = createWorker(workerUrl), importScripts && this.send("importScripts", importScripts), this.$worker.postMessage({
                            init: !0,
                            tlns: tlns,
                            module: mod,
                            classname: classname
                        }), this.$worker;
                    }, this.onMessage = function(e) {
                        var msg = e.data;
                        switch(msg.type){
                            case "event":
                                this._signal(msg.name, {
                                    data: msg.data
                                });
                                break;
                            case "call":
                                var callback = this.callbacks[msg.id];
                                callback && (callback(msg.data), delete this.callbacks[msg.id]);
                                break;
                            case "error":
                                this.reportError(msg.data);
                                break;
                            case "log":
                                window.console && console.log && console.log.apply(console, msg.data);
                        }
                    }, this.reportError = function(err) {
                        window.console && console.error && console.error(err);
                    }, this.$normalizePath = function(path) {
                        return net.qualifyURL(path);
                    }, this.terminate = function() {
                        this._signal("terminate", {}), this.deltaQueue = null, this.$worker.terminate(), this.$worker = null, this.$doc && this.$doc.off("change", this.changeListener), this.$doc = null;
                    }, this.send = function(cmd, args) {
                        this.$worker.postMessage({
                            command: cmd,
                            args: args
                        });
                    }, this.call = function(cmd, args, callback) {
                        if (callback) {
                            var id = this.callbackId++;
                            this.callbacks[id] = callback, args.push(id);
                        }
                        this.send(cmd, args);
                    }, this.emit = function(event, data) {
                        try {
                            data.data && data.data.err && (data.data.err = {
                                message: data.data.err.message,
                                stack: data.data.err.stack,
                                code: data.data.err.code
                            }), this.$worker.postMessage({
                                event: event,
                                data: {
                                    data: data.data
                                }
                            });
                        } catch (ex) {
                            console.error(ex.stack);
                        }
                    }, this.attachToDocument = function(doc) {
                        this.$doc && this.terminate(), this.$doc = doc, this.call("setValue", [
                            doc.getValue()
                        ]), doc.on("change", this.changeListener);
                    }, this.changeListener = function(delta) {
                        this.deltaQueue || (this.deltaQueue = [], setTimeout(this.$sendDeltaQueue, 0)), "insert" == delta.action ? this.deltaQueue.push(delta.start, delta.lines) : this.deltaQueue.push(delta.start, delta.end);
                    }, this.$sendDeltaQueue = function() {
                        var q = this.deltaQueue;
                        q && (this.deltaQueue = null, q.length > 50 && q.length > this.$doc.getLength() >> 1 ? this.call("setValue", [
                            this.$doc.getValue()
                        ]) : this.emit("change", {
                            data: q
                        }));
                    };
                }).call(WorkerClient.prototype), exports.UIWorkerClient = function(topLevelNamespaces, mod, classname) {
                    var main = null, emitSync = !1, sender = Object.create(EventEmitter), messageBuffer = [], workerClient = new WorkerClient({
                        messageBuffer: messageBuffer,
                        terminate: function() {},
                        postMessage: function(e) {
                            messageBuffer.push(e), main && (emitSync ? setTimeout(processNext) : processNext());
                        }
                    });
                    workerClient.setEmitSync = function(val) {
                        emitSync = val;
                    };
                    var processNext = function() {
                        var msg = messageBuffer.shift();
                        msg.command ? main[msg.command].apply(main, msg.args) : msg.event && sender._signal(msg.event, msg.data);
                    };
                    return sender.postMessage = function(msg) {
                        workerClient.onMessage({
                            data: msg
                        });
                    }, sender.callback = function(data, callbackId) {
                        this.postMessage({
                            type: "call",
                            id: callbackId,
                            data: data
                        });
                    }, sender.emit = function(name, data) {
                        this.postMessage({
                            type: "event",
                            name: name,
                            data: data
                        });
                    }, config.loadModule([
                        "worker",
                        mod
                    ], function(Main) {
                        for(main = new Main[classname](sender); messageBuffer.length;)processNext();
                    }), workerClient;
                }, exports.WorkerClient = WorkerClient, exports.createWorker = createWorker;
            }), ace.define("ace/placeholder", [
                "require",
                "exports",
                "module",
                "ace/range",
                "ace/lib/event_emitter",
                "ace/lib/oop"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("./range").Range, EventEmitter = require("./lib/event_emitter").EventEmitter, oop = require("./lib/oop"), PlaceHolder = function(session, length, pos, others, mainClass, othersClass) {
                    var _self = this;
                    this.length = length, this.session = session, this.doc = session.getDocument(), this.mainClass = mainClass, this.othersClass = othersClass, this.$onUpdate = this.onUpdate.bind(this), this.doc.on("change", this.$onUpdate), this.$others = others, this.$onCursorChange = function() {
                        setTimeout(function() {
                            _self.onCursorChange();
                        });
                    }, this.$pos = pos;
                    var undoStack = session.getUndoManager().$undoStack || session.getUndoManager().$undostack || {
                        length: -1
                    };
                    this.$undoStackDepth = undoStack.length, this.setup(), session.selection.on("changeCursor", this.$onCursorChange);
                };
                (function() {
                    oop.implement(this, EventEmitter), this.setup = function() {
                        var _self = this, doc = this.doc, session = this.session;
                        this.selectionBefore = session.selection.toJSON(), session.selection.inMultiSelectMode && session.selection.toSingleRange(), this.pos = doc.createAnchor(this.$pos.row, this.$pos.column);
                        var pos = this.pos;
                        pos.$insertRight = !0, pos.detach(), pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + this.length), this.mainClass, null, !1), this.others = [], this.$others.forEach(function(other) {
                            var anchor = doc.createAnchor(other.row, other.column);
                            anchor.$insertRight = !0, anchor.detach(), _self.others.push(anchor);
                        }), session.setUndoSelect(!1);
                    }, this.showOtherMarkers = function() {
                        if (!this.othersActive) {
                            var session = this.session, _self = this;
                            this.othersActive = !0, this.others.forEach(function(anchor) {
                                anchor.markerId = session.addMarker(new Range(anchor.row, anchor.column, anchor.row, anchor.column + _self.length), _self.othersClass, null, !1);
                            });
                        }
                    }, this.hideOtherMarkers = function() {
                        if (this.othersActive) {
                            this.othersActive = !1;
                            for(var i = 0; i < this.others.length; i++)this.session.removeMarker(this.others[i].markerId);
                        }
                    }, this.onUpdate = function(delta) {
                        if (this.$updating) return this.updateAnchors(delta);
                        if (delta.start.row === delta.end.row && delta.start.row === this.pos.row) {
                            this.$updating = !0;
                            var lengthDiff = "insert" === delta.action ? delta.end.column - delta.start.column : delta.start.column - delta.end.column, inMainRange = delta.start.column >= this.pos.column && delta.start.column <= this.pos.column + this.length + 1, distanceFromStart = delta.start.column - this.pos.column;
                            if (this.updateAnchors(delta), inMainRange && (this.length += lengthDiff), inMainRange && !this.session.$fromUndo) {
                                if ("insert" === delta.action) for(var i = this.others.length - 1; i >= 0; i--){
                                    var otherPos = this.others[i], newPos = {
                                        row: otherPos.row,
                                        column: otherPos.column + distanceFromStart
                                    };
                                    this.doc.insertMergedLines(newPos, delta.lines);
                                }
                                else if ("remove" === delta.action) for(var i = this.others.length - 1; i >= 0; i--){
                                    var otherPos = this.others[i], newPos = {
                                        row: otherPos.row,
                                        column: otherPos.column + distanceFromStart
                                    };
                                    this.doc.remove(new Range(newPos.row, newPos.column, newPos.row, newPos.column - lengthDiff));
                                }
                            }
                            this.$updating = !1, this.updateMarkers();
                        }
                    }, this.updateAnchors = function(delta) {
                        this.pos.onChange(delta);
                        for(var i = this.others.length; i--;)this.others[i].onChange(delta);
                        this.updateMarkers();
                    }, this.updateMarkers = function() {
                        if (!this.$updating) {
                            var _self = this, session = this.session, updateMarker = function(pos, className) {
                                session.removeMarker(pos.markerId), pos.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + _self.length), className, null, !1);
                            };
                            updateMarker(this.pos, this.mainClass);
                            for(var i = this.others.length; i--;)updateMarker(this.others[i], this.othersClass);
                        }
                    }, this.onCursorChange = function(event) {
                        if (!this.$updating && this.session) {
                            var pos = this.session.selection.getCursor();
                            pos.row === this.pos.row && pos.column >= this.pos.column && pos.column <= this.pos.column + this.length ? (this.showOtherMarkers(), this._emit("cursorEnter", event)) : (this.hideOtherMarkers(), this._emit("cursorLeave", event));
                        }
                    }, this.detach = function() {
                        this.session.removeMarker(this.pos && this.pos.markerId), this.hideOtherMarkers(), this.doc.off("change", this.$onUpdate), this.session.selection.off("changeCursor", this.$onCursorChange), this.session.setUndoSelect(!0), this.session = null;
                    }, this.cancel = function() {
                        if (-1 !== this.$undoStackDepth) {
                            for(var undoManager = this.session.getUndoManager(), undosRequired = (undoManager.$undoStack || undoManager.$undostack).length - this.$undoStackDepth, i = 0; i < undosRequired; i++)undoManager.undo(this.session, !0);
                            this.selectionBefore && this.session.selection.fromJSON(this.selectionBefore);
                        }
                    };
                }).call(PlaceHolder.prototype), exports.PlaceHolder = PlaceHolder;
            }), ace.define("ace/mouse/multi_select_handler", [
                "require",
                "exports",
                "module",
                "ace/lib/event",
                "ace/lib/useragent"
            ], function(require, exports, module) {
                var event = require("../lib/event"), useragent = require("../lib/useragent");
                function isSamePoint(p1, p2) {
                    return p1.row == p2.row && p1.column == p2.column;
                }
                exports.onMouseDown = function(e) {
                    var ev = e.domEvent, alt = ev.altKey, shift = ev.shiftKey, ctrl = ev.ctrlKey, accel = e.getAccelKey(), button = e.getButton();
                    if (ctrl && useragent.isMac && (button = ev.button), e.editor.inMultiSelectMode && 2 == button) {
                        e.editor.textInput.onContextMenu(e.domEvent);
                        return;
                    }
                    if (!ctrl && !alt && !accel) {
                        0 === button && e.editor.inMultiSelectMode && e.editor.exitMultiSelectMode();
                        return;
                    }
                    if (0 === button) {
                        var editor = e.editor, selection = editor.selection, isMultiSelect = editor.inMultiSelectMode, pos = e.getDocumentPosition(), cursor = selection.getCursor(), inSelection = e.inSelection() || selection.isEmpty() && isSamePoint(pos, cursor), mouseX = e.x, mouseY = e.y, session = editor.session, screenAnchor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY), screenCursor = screenAnchor;
                        if (editor.$mouseHandler.$enableJumpToDef) ctrl && alt || accel && alt ? selectionMode = shift ? "block" : "add" : alt && editor.$blockSelectEnabled && (selectionMode = "block");
                        else if (accel && !alt) {
                            if (selectionMode = "add", !isMultiSelect && shift) return;
                        } else alt && editor.$blockSelectEnabled && (selectionMode = "block");
                        if (selectionMode && useragent.isMac && ev.ctrlKey && editor.$mouseHandler.cancelContextMenu(), "add" == selectionMode) {
                            if (!isMultiSelect && inSelection) return; // dragging
                            if (!isMultiSelect) {
                                var range = selection.toOrientedRange();
                                editor.addSelectionMarker(range);
                            }
                            var oldRange = selection.rangeList.rangeAtPoint(pos);
                            editor.inVirtualSelectionMode = !0, shift && (oldRange = null, range = selection.ranges[0] || range, editor.removeSelectionMarker(range)), editor.once("mouseup", function() {
                                var tmpSel = selection.toOrientedRange();
                                oldRange && tmpSel.isEmpty() && isSamePoint(oldRange.cursor, tmpSel.cursor) ? selection.substractPoint(tmpSel.cursor) : (shift ? selection.substractPoint(range.cursor) : range && (editor.removeSelectionMarker(range), selection.addRange(range)), selection.addRange(tmpSel)), editor.inVirtualSelectionMode = !1;
                            });
                        } else if ("block" == selectionMode) {
                            e.stop(), editor.inVirtualSelectionMode = !0;
                            var selectionMode, initialRange, rectSel = [], blockSelect = function() {
                                var newCursor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY), cursor = session.screenToDocumentPosition(newCursor.row, newCursor.column, newCursor.offsetX);
                                isSamePoint(screenCursor, newCursor) && isSamePoint(cursor, selection.lead) || (screenCursor = newCursor, editor.selection.moveToPosition(cursor), editor.renderer.scrollCursorIntoView(), editor.removeSelectionMarkers(rectSel), rectSel = selection.rectangularRangeBlock(screenCursor, screenAnchor), editor.$mouseHandler.$clickSelection && 1 == rectSel.length && rectSel[0].isEmpty() && (rectSel[0] = editor.$mouseHandler.$clickSelection.clone()), rectSel.forEach(editor.addSelectionMarker, editor), editor.updateSelectionMarkers());
                            };
                            isMultiSelect && !accel ? selection.toSingleRange() : !isMultiSelect && accel && (initialRange = selection.toOrientedRange(), editor.addSelectionMarker(initialRange)), shift ? screenAnchor = session.documentToScreenPosition(selection.lead) : selection.moveToPosition(pos), screenCursor = {
                                row: -1,
                                column: -1
                            }, event.capture(editor.container, function(e) {
                                mouseX = e.clientX, mouseY = e.clientY;
                            }, function(e) {
                                blockSelect(), clearInterval(timerId), editor.removeSelectionMarkers(rectSel), rectSel.length || (rectSel = [
                                    selection.toOrientedRange()
                                ]), initialRange && (editor.removeSelectionMarker(initialRange), selection.toSingleRange(initialRange));
                                for(var i = 0; i < rectSel.length; i++)selection.addRange(rectSel[i]);
                                editor.inVirtualSelectionMode = !1, editor.$mouseHandler.$clickSelection = null;
                            });
                            var timerId = setInterval(function() {
                                blockSelect();
                            }, 20);
                            return e.preventDefault();
                        }
                    }
                };
            }), ace.define("ace/commands/multi_select_commands", [
                "require",
                "exports",
                "module",
                "ace/keyboard/hash_handler"
            ], function(require, exports, module) {
                exports.defaultCommands = [
                    {
                        name: "addCursorAbove",
                        description: "Add cursor above",
                        exec: function(editor) {
                            editor.selectMoreLines(-1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Up",
                            mac: "Ctrl-Alt-Up"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "addCursorBelow",
                        description: "Add cursor below",
                        exec: function(editor) {
                            editor.selectMoreLines(1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Down",
                            mac: "Ctrl-Alt-Down"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "addCursorAboveSkipCurrent",
                        description: "Add cursor above (skip current)",
                        exec: function(editor) {
                            editor.selectMoreLines(-1, !0);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Up",
                            mac: "Ctrl-Alt-Shift-Up"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "addCursorBelowSkipCurrent",
                        description: "Add cursor below (skip current)",
                        exec: function(editor) {
                            editor.selectMoreLines(1, !0);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Down",
                            mac: "Ctrl-Alt-Shift-Down"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectMoreBefore",
                        description: "Select more before",
                        exec: function(editor) {
                            editor.selectMore(-1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Left",
                            mac: "Ctrl-Alt-Left"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectMoreAfter",
                        description: "Select more after",
                        exec: function(editor) {
                            editor.selectMore(1);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Right",
                            mac: "Ctrl-Alt-Right"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectNextBefore",
                        description: "Select next before",
                        exec: function(editor) {
                            editor.selectMore(-1, !0);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Left",
                            mac: "Ctrl-Alt-Shift-Left"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "selectNextAfter",
                        description: "Select next after",
                        exec: function(editor) {
                            editor.selectMore(1, !0);
                        },
                        bindKey: {
                            win: "Ctrl-Alt-Shift-Right",
                            mac: "Ctrl-Alt-Shift-Right"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    },
                    {
                        name: "toggleSplitSelectionIntoLines",
                        description: "Split into lines",
                        exec: function(editor) {
                            editor.multiSelect.rangeCount > 1 ? editor.multiSelect.joinSelections() : editor.multiSelect.splitIntoLines();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-L",
                            mac: "Ctrl-Alt-L"
                        },
                        readOnly: !0
                    },
                    {
                        name: "splitSelectionIntoLines",
                        description: "Split into lines",
                        exec: function(editor) {
                            editor.multiSelect.splitIntoLines();
                        },
                        readOnly: !0
                    },
                    {
                        name: "alignCursors",
                        description: "Align cursors",
                        exec: function(editor) {
                            editor.alignCursors();
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
                        exec: function(editor) {
                            editor.findAll();
                        },
                        bindKey: {
                            win: "Ctrl-Alt-K",
                            mac: "Ctrl-Alt-G"
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0
                    }
                ], exports.multiSelectCommands = [
                    {
                        name: "singleSelection",
                        description: "Single selection",
                        bindKey: "esc",
                        exec: function(editor) {
                            editor.exitMultiSelectMode();
                        },
                        scrollIntoView: "cursor",
                        readOnly: !0,
                        isAvailable: function(editor) {
                            return editor && editor.inMultiSelectMode;
                        }
                    }
                ];
                var HashHandler = require("../keyboard/hash_handler").HashHandler;
                exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);
            }), ace.define("ace/multi_select", [
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
                "ace/config"
            ], function(require, exports, module) {
                var RangeList = require("./range_list").RangeList, Range = require("./range").Range, Selection = require("./selection").Selection, onMouseDown = require("./mouse/multi_select_handler").onMouseDown, event = require("./lib/event"), lang = require("./lib/lang"), commands = require("./commands/multi_select_commands");
                exports.commands = commands.defaultCommands.concat(commands.multiSelectCommands);
                var search = new (require("./search")).Search();
                (function() {
                    this.getSelectionMarkers = function() {
                        return this.$selectionMarkers;
                    };
                }).call(require("./edit_session").EditSession.prototype), (function() {
                    this.ranges = null, this.rangeList = null, this.addRange = function(range, $blockChangeEvents) {
                        if (range) {
                            if (!this.inMultiSelectMode && 0 === this.rangeCount) {
                                var oldRange = this.toOrientedRange();
                                if (this.rangeList.add(oldRange), this.rangeList.add(range), 2 != this.rangeList.ranges.length) return this.rangeList.removeAll(), $blockChangeEvents || this.fromOrientedRange(range);
                                this.rangeList.removeAll(), this.rangeList.add(oldRange), this.$onAddRange(oldRange);
                            }
                            range.cursor || (range.cursor = range.end);
                            var removed = this.rangeList.add(range);
                            return this.$onAddRange(range), removed.length && this.$onRemoveRange(removed), this.rangeCount > 1 && !this.inMultiSelectMode && (this._signal("multiSelect"), this.inMultiSelectMode = !0, this.session.$undoSelect = !1, this.rangeList.attach(this.session)), $blockChangeEvents || this.fromOrientedRange(range);
                        }
                    }, this.toSingleRange = function(range) {
                        range = range || this.ranges[0];
                        var removed = this.rangeList.removeAll();
                        removed.length && this.$onRemoveRange(removed), range && this.fromOrientedRange(range);
                    }, this.substractPoint = function(pos) {
                        var removed = this.rangeList.substractPoint(pos);
                        if (removed) return this.$onRemoveRange(removed), removed[0];
                    }, this.mergeOverlappingRanges = function() {
                        var removed = this.rangeList.merge();
                        removed.length && this.$onRemoveRange(removed);
                    }, this.$onAddRange = function(range) {
                        this.rangeCount = this.rangeList.ranges.length, this.ranges.unshift(range), this._signal("addRange", {
                            range: range
                        });
                    }, this.$onRemoveRange = function(removed) {
                        if (this.rangeCount = this.rangeList.ranges.length, 1 == this.rangeCount && this.inMultiSelectMode) {
                            var lastRange = this.rangeList.ranges.pop();
                            removed.push(lastRange), this.rangeCount = 0;
                        }
                        for(var i = removed.length; i--;){
                            var index = this.ranges.indexOf(removed[i]);
                            this.ranges.splice(index, 1);
                        }
                        this._signal("removeRange", {
                            ranges: removed
                        }), 0 === this.rangeCount && this.inMultiSelectMode && (this.inMultiSelectMode = !1, this._signal("singleSelect"), this.session.$undoSelect = !0, this.rangeList.detach(this.session)), (lastRange = lastRange || this.ranges[0]) && !lastRange.isEqual(this.getRange()) && this.fromOrientedRange(lastRange);
                    }, this.$initRangeList = function() {
                        this.rangeList || (this.rangeList = new RangeList(), this.ranges = [], this.rangeCount = 0);
                    }, this.getAllRanges = function() {
                        return this.rangeCount ? this.rangeList.ranges.concat() : [
                            this.getRange()
                        ];
                    }, this.splitIntoLines = function() {
                        for(var ranges = this.ranges.length ? this.ranges : [
                            this.getRange()
                        ], newRanges = [], i = 0; i < ranges.length; i++){
                            var range = ranges[i], row = range.start.row, endRow = range.end.row;
                            if (row === endRow) newRanges.push(range.clone());
                            else {
                                for(newRanges.push(new Range(row, range.start.column, row, this.session.getLine(row).length)); ++row < endRow;)newRanges.push(this.getLineRange(row, !0));
                                newRanges.push(new Range(endRow, 0, endRow, range.end.column));
                            }
                            0 != i || this.isBackwards() || (newRanges = newRanges.reverse());
                        }
                        this.toSingleRange();
                        for(var i = newRanges.length; i--;)this.addRange(newRanges[i]);
                    }, this.joinSelections = function() {
                        var ranges = this.rangeList.ranges, lastRange = ranges[ranges.length - 1], range = Range.fromPoints(ranges[0].start, lastRange.end);
                        this.toSingleRange(), this.setSelectionRange(range, lastRange.cursor == lastRange.start);
                    }, this.toggleBlockSelection = function() {
                        if (this.rangeCount > 1) {
                            var ranges = this.rangeList.ranges, lastRange = ranges[ranges.length - 1], range = Range.fromPoints(ranges[0].start, lastRange.end);
                            this.toSingleRange(), this.setSelectionRange(range, lastRange.cursor == lastRange.start);
                        } else {
                            var cursor = this.session.documentToScreenPosition(this.cursor), anchor = this.session.documentToScreenPosition(this.anchor);
                            this.rectangularRangeBlock(cursor, anchor).forEach(this.addRange, this);
                        }
                    }, this.rectangularRangeBlock = function(screenCursor, screenAnchor, includeEmptyLines) {
                        var docEnd, rectSel = [], xBackwards = screenCursor.column < screenAnchor.column;
                        if (xBackwards) var startColumn = screenCursor.column, endColumn = screenAnchor.column, startOffsetX = screenCursor.offsetX, endOffsetX = screenAnchor.offsetX;
                        else var startColumn = screenAnchor.column, endColumn = screenCursor.column, startOffsetX = screenAnchor.offsetX, endOffsetX = screenCursor.offsetX;
                        var yBackwards = screenCursor.row < screenAnchor.row;
                        if (yBackwards) var startRow = screenCursor.row, endRow = screenAnchor.row;
                        else var startRow = screenAnchor.row, endRow = screenCursor.row;
                        startColumn < 0 && (startColumn = 0), startRow < 0 && (startRow = 0), startRow == endRow && (includeEmptyLines = !0);
                        for(var row = startRow; row <= endRow; row++){
                            var p1, p2, range = Range.fromPoints(this.session.screenToDocumentPosition(row, startColumn, startOffsetX), this.session.screenToDocumentPosition(row, endColumn, endOffsetX));
                            if (range.isEmpty()) {
                                if (docEnd && (p1 = range.end, p2 = docEnd, p1.row == p2.row && p1.column == p2.column)) break;
                                docEnd = range.end;
                            }
                            range.cursor = xBackwards ? range.start : range.end, rectSel.push(range);
                        }
                        if (yBackwards && rectSel.reverse(), !includeEmptyLines) {
                            for(var end = rectSel.length - 1; rectSel[end].isEmpty() && end > 0;)end--;
                            if (end > 0) for(var start = 0; rectSel[start].isEmpty();)start++;
                            for(var i = end; i >= start; i--)rectSel[i].isEmpty() && rectSel.splice(i, 1);
                        }
                        return rectSel;
                    };
                }).call(Selection.prototype);
                var Editor = require("./editor").Editor;
                function MultiSelect(editor) {
                    editor.$multiselectOnSessionChange || (editor.$onAddRange = editor.$onAddRange.bind(editor), editor.$onRemoveRange = editor.$onRemoveRange.bind(editor), editor.$onMultiSelect = editor.$onMultiSelect.bind(editor), editor.$onSingleSelect = editor.$onSingleSelect.bind(editor), editor.$multiselectOnSessionChange = exports.onSessionChange.bind(editor), editor.$checkMultiselectChange = editor.$checkMultiselectChange.bind(editor), editor.$multiselectOnSessionChange(editor), editor.on("changeSession", editor.$multiselectOnSessionChange), editor.on("mousedown", onMouseDown), editor.commands.addCommands(commands.defaultCommands), function(editor) {
                        if (editor.textInput) {
                            var el = editor.textInput.getElement(), altCursor = !1;
                            event.addListener(el, "keydown", function(e) {
                                var altDown = 18 == e.keyCode && !(e.ctrlKey || e.shiftKey || e.metaKey);
                                editor.$blockSelectEnabled && altDown ? altCursor || (editor.renderer.setMouseCursor("crosshair"), altCursor = !0) : altCursor && reset();
                            }, editor), event.addListener(el, "keyup", reset, editor), event.addListener(el, "blur", reset, editor);
                        }
                        function reset(e) {
                            altCursor && (editor.renderer.setMouseCursor(""), altCursor = !1);
                        }
                    }(editor));
                }
                (function() {
                    this.updateSelectionMarkers = function() {
                        this.renderer.updateCursor(), this.renderer.updateBackMarkers();
                    }, this.addSelectionMarker = function(orientedRange) {
                        orientedRange.cursor || (orientedRange.cursor = orientedRange.end);
                        var style = this.getSelectionStyle();
                        return orientedRange.marker = this.session.addMarker(orientedRange, "ace_selection", style), this.session.$selectionMarkers.push(orientedRange), this.session.selectionMarkerCount = this.session.$selectionMarkers.length, orientedRange;
                    }, this.removeSelectionMarker = function(range) {
                        if (range.marker) {
                            this.session.removeMarker(range.marker);
                            var index = this.session.$selectionMarkers.indexOf(range);
                            -1 != index && this.session.$selectionMarkers.splice(index, 1), this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
                        }
                    }, this.removeSelectionMarkers = function(ranges) {
                        for(var markerList = this.session.$selectionMarkers, i = ranges.length; i--;){
                            var range = ranges[i];
                            if (range.marker) {
                                this.session.removeMarker(range.marker);
                                var index = markerList.indexOf(range);
                                -1 != index && markerList.splice(index, 1);
                            }
                        }
                        this.session.selectionMarkerCount = markerList.length;
                    }, this.$onAddRange = function(e) {
                        this.addSelectionMarker(e.range), this.renderer.updateCursor(), this.renderer.updateBackMarkers();
                    }, this.$onRemoveRange = function(e) {
                        this.removeSelectionMarkers(e.ranges), this.renderer.updateCursor(), this.renderer.updateBackMarkers();
                    }, this.$onMultiSelect = function(e) {
                        this.inMultiSelectMode || (this.inMultiSelectMode = !0, this.setStyle("ace_multiselect"), this.keyBinding.addKeyboardHandler(commands.keyboardHandler), this.commands.setDefaultHandler("exec", this.$onMultiSelectExec), this.renderer.updateCursor(), this.renderer.updateBackMarkers());
                    }, this.$onSingleSelect = function(e) {
                        this.session.multiSelect.inVirtualMode || (this.inMultiSelectMode = !1, this.unsetStyle("ace_multiselect"), this.keyBinding.removeKeyboardHandler(commands.keyboardHandler), this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec), this.renderer.updateCursor(), this.renderer.updateBackMarkers(), this._emit("changeSelection"));
                    }, this.$onMultiSelectExec = function(e) {
                        var command = e.command, editor = e.editor;
                        if (editor.multiSelect) {
                            if (command.multiSelectAction) "forEach" == command.multiSelectAction ? result = editor.forEachSelection(command, e.args) : "forEachLine" == command.multiSelectAction ? result = editor.forEachSelection(command, e.args, !0) : "single" == command.multiSelectAction ? (editor.exitMultiSelectMode(), result = command.exec(editor, e.args || {})) : result = command.multiSelectAction(editor, e.args || {});
                            else {
                                var result = command.exec(editor, e.args || {});
                                editor.multiSelect.addRange(editor.multiSelect.toOrientedRange()), editor.multiSelect.mergeOverlappingRanges();
                            }
                            return result;
                        }
                    }, this.forEachSelection = function(cmd, args, options) {
                        if (!this.inVirtualSelectionMode) {
                            var result, keepOrder = options && options.keepOrder, $byLines = !0 == options || options && options.$byLines, session = this.session, selection = this.selection, rangeList = selection.rangeList, ranges = (keepOrder ? selection : rangeList).ranges;
                            if (!ranges.length) return cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
                            var reg = selection._eventRegistry;
                            selection._eventRegistry = {};
                            var tmpSel = new Selection(session);
                            this.inVirtualSelectionMode = !0;
                            for(var i = ranges.length; i--;){
                                if ($byLines) for(; i > 0 && ranges[i].start.row == ranges[i - 1].end.row;)i--;
                                tmpSel.fromOrientedRange(ranges[i]), tmpSel.index = i, this.selection = session.selection = tmpSel;
                                var cmdResult = cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
                                result || void 0 === cmdResult || (result = cmdResult), tmpSel.toOrientedRange(ranges[i]);
                            }
                            tmpSel.detach(), this.selection = session.selection = selection, this.inVirtualSelectionMode = !1, selection._eventRegistry = reg, selection.mergeOverlappingRanges(), selection.ranges[0] && selection.fromOrientedRange(selection.ranges[0]);
                            var anim = this.renderer.$scrollAnimation;
                            return this.onCursorChange(), this.onSelectionChange(), anim && anim.from == anim.to && this.renderer.animateScrolling(anim.from), result;
                        }
                    }, this.exitMultiSelectMode = function() {
                        this.inMultiSelectMode && !this.inVirtualSelectionMode && this.multiSelect.toSingleRange();
                    }, this.getSelectedText = function() {
                        var text = "";
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            for(var ranges = this.multiSelect.rangeList.ranges, buf = [], i = 0; i < ranges.length; i++)buf.push(this.session.getTextRange(ranges[i]));
                            var nl = this.session.getDocument().getNewLineCharacter();
                            (text = buf.join(nl)).length == (buf.length - 1) * nl.length && (text = "");
                        } else this.selection.isEmpty() || (text = this.session.getTextRange(this.getSelectionRange()));
                        return text;
                    }, this.$checkMultiselectChange = function(e, anchor) {
                        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                            var range = this.multiSelect.ranges[0];
                            if (!this.multiSelect.isEmpty() || anchor != this.multiSelect.anchor) {
                                var pos = anchor == this.multiSelect.anchor ? range.cursor == range.start ? range.end : range.start : range.cursor;
                                pos.row != anchor.row || this.session.$clipPositionToDocument(pos.row, pos.column).column != anchor.column ? this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange()) : this.multiSelect.mergeOverlappingRanges();
                            }
                        }
                    }, this.findAll = function(needle, options, additive) {
                        if ((options = options || {}).needle = needle || options.needle, void 0 == options.needle) {
                            var range = this.selection.isEmpty() ? this.selection.getWordRange() : this.selection.getRange();
                            options.needle = this.session.getTextRange(range);
                        }
                        this.$search.set(options);
                        var ranges = this.$search.findAll(this.session);
                        if (!ranges.length) return 0;
                        var selection = this.multiSelect;
                        additive || selection.toSingleRange(ranges[0]);
                        for(var i = ranges.length; i--;)selection.addRange(ranges[i], !0);
                        return range && selection.rangeList.rangeAtPoint(range.start) && selection.addRange(range, !0), ranges.length;
                    }, this.selectMoreLines = function(dir, skip) {
                        var range = this.selection.toOrientedRange(), isBackwards = range.cursor == range.end, screenLead = this.session.documentToScreenPosition(range.cursor);
                        this.selection.$desiredColumn && (screenLead.column = this.selection.$desiredColumn);
                        var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);
                        if (range.isEmpty()) var anchor = lead;
                        else var screenAnchor = this.session.documentToScreenPosition(isBackwards ? range.end : range.start), anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
                        if (isBackwards) {
                            var newRange = Range.fromPoints(lead, anchor);
                            newRange.cursor = newRange.start;
                        } else {
                            var newRange = Range.fromPoints(anchor, lead);
                            newRange.cursor = newRange.end;
                        }
                        if (newRange.desiredColumn = screenLead.column, this.selection.inMultiSelectMode) {
                            if (skip) var toRemove = range.cursor;
                        } else this.selection.addRange(range);
                        this.selection.addRange(newRange), toRemove && this.selection.substractPoint(toRemove);
                    }, this.transposeSelections = function(dir) {
                        for(var session = this.session, sel = session.multiSelect, all = sel.ranges, i = all.length; i--;){
                            var range = all[i];
                            if (range.isEmpty()) {
                                var tmp = session.getWordRange(range.start.row, range.start.column);
                                range.start.row = tmp.start.row, range.start.column = tmp.start.column, range.end.row = tmp.end.row, range.end.column = tmp.end.column;
                            }
                        }
                        sel.mergeOverlappingRanges();
                        for(var words = [], i = all.length; i--;){
                            var range = all[i];
                            words.unshift(session.getTextRange(range));
                        }
                        dir < 0 ? words.unshift(words.pop()) : words.push(words.shift());
                        for(var i = all.length; i--;){
                            var range = all[i], tmp = range.clone();
                            session.replace(range, words[i]), range.start.row = tmp.start.row, range.start.column = tmp.start.column;
                        }
                        sel.fromOrientedRange(sel.ranges[0]);
                    }, this.selectMore = function(dir, skip, stopAtFirst) {
                        var session = this.session, range = session.multiSelect.toOrientedRange();
                        if (!range.isEmpty() || ((range = session.getWordRange(range.start.row, range.start.column)).cursor = -1 == dir ? range.start : range.end, this.multiSelect.addRange(range), !stopAtFirst)) {
                            var needle = session.getTextRange(range), newRange = (search.$options.wrap = !0, search.$options.needle = needle, search.$options.backwards = -1 == dir, search.find(session));
                            newRange && (newRange.cursor = -1 == dir ? newRange.start : newRange.end, this.session.unfold(newRange), this.multiSelect.addRange(newRange), this.renderer.scrollCursorIntoView(null, 0.5)), skip && this.multiSelect.substractPoint(range.cursor);
                        }
                    }, this.alignCursors = function() {
                        var session = this.session, sel = session.multiSelect, ranges = sel.ranges, row = -1, sameRowRanges = ranges.filter(function(r) {
                            if (r.cursor.row == row) return !0;
                            row = r.cursor.row;
                        });
                        if (ranges.length && sameRowRanges.length != ranges.length - 1) {
                            sameRowRanges.forEach(function(r) {
                                sel.substractPoint(r.cursor);
                            });
                            var maxCol = 0, minSpace = 1 / 0, spaceOffsets = ranges.map(function(r) {
                                var p = r.cursor, spaceOffset = session.getLine(p.row).substr(p.column).search(/\S/g);
                                return -1 == spaceOffset && (spaceOffset = 0), p.column > maxCol && (maxCol = p.column), spaceOffset < minSpace && (minSpace = spaceOffset), spaceOffset;
                            });
                            ranges.forEach(function(r, i) {
                                var p = r.cursor, l = maxCol - p.column, d = spaceOffsets[i] - minSpace;
                                l > d ? session.insert(p, lang.stringRepeat(" ", l - d)) : session.remove(new Range(p.row, p.column, p.row, p.column - l + d)), r.start.column = r.end.column = maxCol, r.start.row = r.end.row = p.row, r.cursor = r.end;
                            }), sel.fromOrientedRange(ranges[0]), this.renderer.updateCursor(), this.renderer.updateBackMarkers();
                        } else {
                            var range = this.selection.getRange(), fr = range.start.row, lr = range.end.row, guessRange = fr == lr;
                            if (guessRange) {
                                var line, max = this.session.getLength();
                                do line = this.session.getLine(lr);
                                while (/[=:]/.test(line) && ++lr < max)
                                do line = this.session.getLine(fr);
                                while (/[=:]/.test(line) && --fr > 0)
                                fr < 0 && (fr = 0), lr >= max && (lr = max - 1);
                            }
                            var lines = this.session.removeFullLines(fr, lr);
                            lines = this.$reAlignText(lines, guessRange), this.session.insert({
                                row: fr,
                                column: 0
                            }, lines.join("\n") + "\n"), guessRange || (range.start.column = 0, range.end.column = lines[lines.length - 1].length), this.selection.setRange(range);
                        }
                    }, this.$reAlignText = function(lines, forceLeft) {
                        var startW, textW, endW, isLeftAligned = !0, isRightAligned = !0;
                        return lines.map(function(line) {
                            var m = line.match(/(\s*)(.*?)(\s*)([=:].*)/);
                            return m ? (null == startW ? (startW = m[1].length, textW = m[2].length, endW = m[3].length) : (startW + textW + endW != m[1].length + m[2].length + m[3].length && (isRightAligned = !1), startW != m[1].length && (isLeftAligned = !1), startW > m[1].length && (startW = m[1].length), textW < m[2].length && (textW = m[2].length), endW > m[3].length && (endW = m[3].length)), m) : [
                                line
                            ];
                        }).map(forceLeft ? alignLeft : isLeftAligned ? isRightAligned ? function(m) {
                            return m[2] ? spaces(startW + textW - m[2].length) + m[2] + spaces(endW) + m[4].replace(/^([=:])\s+/, "$1 ") : m[0];
                        } : alignLeft : function(m) {
                            return m[2] ? spaces(startW) + m[2] + spaces(endW) + m[4].replace(/^([=:])\s+/, "$1 ") : m[0];
                        });
                        function spaces(n) {
                            return lang.stringRepeat(" ", n);
                        }
                        function alignLeft(m) {
                            return m[2] ? spaces(startW) + m[2] + spaces(textW - m[2].length + endW) + m[4].replace(/^([=:])\s+/, "$1 ") : m[0];
                        }
                    };
                }).call(Editor.prototype), exports.onSessionChange = function(e) {
                    var session = e.session;
                    session && !session.multiSelect && (session.$selectionMarkers = [], session.selection.$initRangeList(), session.multiSelect = session.selection), this.multiSelect = session && session.multiSelect;
                    var oldSession = e.oldSession;
                    oldSession && (oldSession.multiSelect.off("addRange", this.$onAddRange), oldSession.multiSelect.off("removeRange", this.$onRemoveRange), oldSession.multiSelect.off("multiSelect", this.$onMultiSelect), oldSession.multiSelect.off("singleSelect", this.$onSingleSelect), oldSession.multiSelect.lead.off("change", this.$checkMultiselectChange), oldSession.multiSelect.anchor.off("change", this.$checkMultiselectChange)), session && (session.multiSelect.on("addRange", this.$onAddRange), session.multiSelect.on("removeRange", this.$onRemoveRange), session.multiSelect.on("multiSelect", this.$onMultiSelect), session.multiSelect.on("singleSelect", this.$onSingleSelect), session.multiSelect.lead.on("change", this.$checkMultiselectChange), session.multiSelect.anchor.on("change", this.$checkMultiselectChange)), session && this.inMultiSelectMode != session.selection.inMultiSelectMode && (session.selection.inMultiSelectMode ? this.$onMultiSelect() : this.$onSingleSelect());
                }, exports.MultiSelect = MultiSelect, require("./config").defineOptions(Editor.prototype, "editor", {
                    enableMultiselect: {
                        set: function(val) {
                            MultiSelect(this), val ? (this.on("changeSession", this.$multiselectOnSessionChange), this.on("mousedown", onMouseDown)) : (this.off("changeSession", this.$multiselectOnSessionChange), this.off("mousedown", onMouseDown));
                        },
                        value: !0
                    },
                    enableBlockSelect: {
                        set: function(val) {
                            this.$blockSelectEnabled = val;
                        },
                        value: !0
                    }
                });
            }), ace.define("ace/mode/folding/fold_mode", [
                "require",
                "exports",
                "module",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var Range = require("../../range").Range;
                (function() {
                    this.foldingStartMarker = null, this.foldingStopMarker = null, this.getFoldWidget = function(session, foldStyle, row) {
                        var line = session.getLine(row);
                        return this.foldingStartMarker.test(line) ? "start" : "markbeginend" == foldStyle && this.foldingStopMarker && this.foldingStopMarker.test(line) ? "end" : "";
                    }, this.getFoldWidgetRange = function(session, foldStyle, row) {
                        return null;
                    }, this.indentationBlock = function(session, row, column) {
                        var re = /\S/, line = session.getLine(row), startLevel = line.search(re);
                        if (-1 != startLevel) {
                            for(var startColumn = column || line.length, maxRow = session.getLength(), startRow = row, endRow = row; ++row < maxRow;){
                                var level = session.getLine(row).search(re);
                                if (-1 != level) {
                                    if (level <= startLevel) {
                                        var token = session.getTokenAt(row, 0);
                                        if (!token || "string" !== token.type) break;
                                    }
                                    endRow = row;
                                }
                            }
                            if (endRow > startRow) {
                                var endColumn = session.getLine(endRow).length;
                                return new Range(startRow, startColumn, endRow, endColumn);
                            }
                        }
                    }, this.openingBracketBlock = function(session, bracket, row, column, typeRe) {
                        var start = {
                            row: row,
                            column: column + 1
                        }, end = session.$findClosingBracket(bracket, start, typeRe);
                        if (end) {
                            var fw = session.foldWidgets[end.row];
                            return null == fw && (fw = session.getFoldWidget(end.row)), "start" == fw && end.row > start.row && (end.row--, end.column = session.getLine(end.row).length), Range.fromPoints(start, end);
                        }
                    }, this.closingBracketBlock = function(session, bracket, row, column, typeRe) {
                        var end = {
                            row: row,
                            column: column
                        }, start = session.$findOpeningBracket(bracket, end);
                        if (start) return start.column++, end.column--, Range.fromPoints(start, end);
                    };
                }).call((exports.FoldMode = function() {}).prototype);
            }), ace.define("ace/theme/textmate", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                exports.isDark = !1, exports.cssClass = "ace-tm", exports.cssText = '.ace-tm .ace_gutter {\
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
', exports.$id = "ace/theme/textmate", require("../lib/dom").importCssString(exports.cssText, exports.cssClass, !1);
            }), ace.define("ace/line_widgets", [
                "require",
                "exports",
                "module",
                "ace/lib/dom"
            ], function(require, exports, module) {
                "use strict";
                var dom = require("./lib/dom");
                function LineWidgets(session) {
                    this.session = session, this.session.widgetManager = this, this.session.getRowLength = this.getRowLength, this.session.$getWidgetScreenLength = this.$getWidgetScreenLength, this.updateOnChange = this.updateOnChange.bind(this), this.renderWidgets = this.renderWidgets.bind(this), this.measureWidgets = this.measureWidgets.bind(this), this.session._changedWidgets = [], this.$onChangeEditor = this.$onChangeEditor.bind(this), this.session.on("change", this.updateOnChange), this.session.on("changeFold", this.updateOnFold), this.session.on("changeEditor", this.$onChangeEditor);
                }
                (function() {
                    this.getRowLength = function(row) {
                        var h;
                        return (h = this.lineWidgets && this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0, this.$useWrapMode && this.$wrapData[row]) ? this.$wrapData[row].length + 1 + h : 1 + h;
                    }, this.$getWidgetScreenLength = function() {
                        var screenRows = 0;
                        return this.lineWidgets.forEach(function(w) {
                            w && w.rowCount && !w.hidden && (screenRows += w.rowCount);
                        }), screenRows;
                    }, this.$onChangeEditor = function(e) {
                        this.attach(e.editor);
                    }, this.attach = function(editor) {
                        editor && editor.widgetManager && editor.widgetManager != this && editor.widgetManager.detach(), this.editor != editor && (this.detach(), this.editor = editor, editor && (editor.widgetManager = this, editor.renderer.on("beforeRender", this.measureWidgets), editor.renderer.on("afterRender", this.renderWidgets)));
                    }, this.detach = function(e) {
                        var editor = this.editor;
                        if (editor) {
                            this.editor = null, editor.widgetManager = null, editor.renderer.off("beforeRender", this.measureWidgets), editor.renderer.off("afterRender", this.renderWidgets);
                            var lineWidgets = this.session.lineWidgets;
                            lineWidgets && lineWidgets.forEach(function(w) {
                                w && w.el && w.el.parentNode && (w._inDocument = !1, w.el.parentNode.removeChild(w.el));
                            });
                        }
                    }, this.updateOnFold = function(e, session) {
                        var lineWidgets = session.lineWidgets;
                        if (lineWidgets && e.action) {
                            for(var fold = e.data, start = fold.start.row, end = fold.end.row, hide = "add" == e.action, i = start + 1; i < end; i++)lineWidgets[i] && (lineWidgets[i].hidden = hide);
                            lineWidgets[end] && (hide ? lineWidgets[start] ? lineWidgets[end].hidden = hide : lineWidgets[start] = lineWidgets[end] : (lineWidgets[start] == lineWidgets[end] && (lineWidgets[start] = void 0), lineWidgets[end].hidden = hide));
                        }
                    }, this.updateOnChange = function(delta) {
                        var lineWidgets = this.session.lineWidgets;
                        if (lineWidgets) {
                            var startRow = delta.start.row, len = delta.end.row - startRow;
                            if (0 === len) ;
                            else if ("remove" == delta.action) {
                                var removed = lineWidgets.splice(startRow + 1, len);
                                !lineWidgets[startRow] && removed[removed.length - 1] && (lineWidgets[startRow] = removed.pop()), removed.forEach(function(w) {
                                    w && this.removeLineWidget(w);
                                }, this), this.$updateRows();
                            } else {
                                var args = Array(len);
                                lineWidgets[startRow] && null != lineWidgets[startRow].column && delta.start.column > lineWidgets[startRow].column && startRow++, args.unshift(startRow, 0), lineWidgets.splice.apply(lineWidgets, args), this.$updateRows();
                            }
                        }
                    }, this.$updateRows = function() {
                        var lineWidgets = this.session.lineWidgets;
                        if (lineWidgets) {
                            var noWidgets = !0;
                            lineWidgets.forEach(function(w, i) {
                                if (w) for(noWidgets = !1, w.row = i; w.$oldWidget;)w.$oldWidget.row = i, w = w.$oldWidget;
                            }), noWidgets && (this.session.lineWidgets = null);
                        }
                    }, this.$registerLineWidget = function(w) {
                        this.session.lineWidgets || (this.session.lineWidgets = Array(this.session.getLength()));
                        var old = this.session.lineWidgets[w.row];
                        return old && (w.$oldWidget = old, old.el && old.el.parentNode && (old.el.parentNode.removeChild(old.el), old._inDocument = !1)), this.session.lineWidgets[w.row] = w, w;
                    }, this.addLineWidget = function(w) {
                        if (this.$registerLineWidget(w), w.session = this.session, !this.editor) return w;
                        var renderer = this.editor.renderer;
                        w.html && !w.el && (w.el = dom.createElement("div"), w.el.innerHTML = w.html), w.el && (dom.addCssClass(w.el, "ace_lineWidgetContainer"), w.el.style.position = "absolute", w.el.style.zIndex = 5, renderer.container.appendChild(w.el), w._inDocument = !0, w.coverGutter || (w.el.style.zIndex = 3), null == w.pixelHeight && (w.pixelHeight = w.el.offsetHeight)), null == w.rowCount && (w.rowCount = w.pixelHeight / renderer.layerConfig.lineHeight);
                        var fold = this.session.getFoldAt(w.row, 0);
                        if (w.$fold = fold, fold) {
                            var lineWidgets = this.session.lineWidgets;
                            w.row != fold.end.row || lineWidgets[fold.start.row] ? w.hidden = !0 : lineWidgets[fold.start.row] = w;
                        }
                        return this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: w.row
                                }
                            }
                        }), this.$updateRows(), this.renderWidgets(null, renderer), this.onWidgetChanged(w), w;
                    }, this.removeLineWidget = function(w) {
                        if (w._inDocument = !1, w.session = null, w.el && w.el.parentNode && w.el.parentNode.removeChild(w.el), w.editor && w.editor.destroy) try {
                            w.editor.destroy();
                        } catch (e) {}
                        if (this.session.lineWidgets) {
                            var w1 = this.session.lineWidgets[w.row];
                            if (w1 == w) this.session.lineWidgets[w.row] = w.$oldWidget, w.$oldWidget && this.onWidgetChanged(w.$oldWidget);
                            else for(; w1;){
                                if (w1.$oldWidget == w) {
                                    w1.$oldWidget = w.$oldWidget;
                                    break;
                                }
                                w1 = w1.$oldWidget;
                            }
                        }
                        this.session._emit("changeFold", {
                            data: {
                                start: {
                                    row: w.row
                                }
                            }
                        }), this.$updateRows();
                    }, this.getWidgetsAtRow = function(row) {
                        for(var lineWidgets = this.session.lineWidgets, w = lineWidgets && lineWidgets[row], list = []; w;)list.push(w), w = w.$oldWidget;
                        return list;
                    }, this.onWidgetChanged = function(w) {
                        this.session._changedWidgets.push(w), this.editor && this.editor.renderer.updateFull();
                    }, this.measureWidgets = function(e, renderer) {
                        var changedWidgets = this.session._changedWidgets, config = renderer.layerConfig;
                        if (changedWidgets && changedWidgets.length) {
                            for(var min = 1 / 0, i = 0; i < changedWidgets.length; i++){
                                var w = changedWidgets[i];
                                if (w && w.el && w.session == this.session) {
                                    if (!w._inDocument) {
                                        if (this.session.lineWidgets[w.row] != w) continue;
                                        w._inDocument = !0, renderer.container.appendChild(w.el);
                                    }
                                    w.h = w.el.offsetHeight, w.fixedWidth || (w.w = w.el.offsetWidth, w.screenWidth = Math.ceil(w.w / config.characterWidth));
                                    var rowCount = w.h / config.lineHeight;
                                    w.coverLine && (rowCount -= this.session.getRowLineCount(w.row)) < 0 && (rowCount = 0), w.rowCount != rowCount && (w.rowCount = rowCount, w.row < min && (min = w.row));
                                }
                            }
                            min != 1 / 0 && (this.session._emit("changeFold", {
                                data: {
                                    start: {
                                        row: min
                                    }
                                }
                            }), this.session.lineWidgetWidth = null), this.session._changedWidgets = [];
                        }
                    }, this.renderWidgets = function(e, renderer) {
                        var config = renderer.layerConfig, lineWidgets = this.session.lineWidgets;
                        if (lineWidgets) {
                            for(var first = Math.min(this.firstRow, config.firstRow), last = Math.max(this.lastRow, config.lastRow, lineWidgets.length); first > 0 && !lineWidgets[first];)first--;
                            this.firstRow = config.firstRow, this.lastRow = config.lastRow, renderer.$cursorLayer.config = config;
                            for(var i = first; i <= last; i++){
                                var w = lineWidgets[i];
                                if (w && w.el) {
                                    if (w.hidden) {
                                        w.el.style.top = -100 - (w.pixelHeight || 0) + "px";
                                        continue;
                                    }
                                    w._inDocument || (w._inDocument = !0, renderer.container.appendChild(w.el));
                                    var top = renderer.$cursorLayer.getPixelPosition({
                                        row: i,
                                        column: 0
                                    }, !0).top;
                                    w.coverLine || (top += config.lineHeight * this.session.getRowLineCount(w.row)), w.el.style.top = top - config.offset + "px";
                                    var left = w.coverGutter ? 0 : renderer.gutterWidth;
                                    w.fixedWidth || (left -= renderer.scrollLeft), w.el.style.left = left + "px", w.fullWidth && w.screenWidth && (w.el.style.minWidth = config.width + 2 * config.padding + "px"), w.fixedWidth ? w.el.style.right = renderer.scrollBar.getWidth() + "px" : w.el.style.right = "";
                                }
                            }
                        }
                    };
                }).call(LineWidgets.prototype), exports.LineWidgets = LineWidgets;
            }), ace.define("ace/ext/error_marker", [
                "require",
                "exports",
                "module",
                "ace/line_widgets",
                "ace/lib/dom",
                "ace/range"
            ], function(require, exports, module) {
                "use strict";
                var LineWidgets = require("../line_widgets").LineWidgets, dom = require("../lib/dom"), Range = require("../range").Range;
                exports.showErrorMarker = function(editor, dir) {
                    var gutterAnno, session = editor.session;
                    session.widgetManager || (session.widgetManager = new LineWidgets(session), session.widgetManager.attach(editor));
                    var pos = editor.getCursorPosition(), row = pos.row, oldWidget = session.widgetManager.getWidgetsAtRow(row).filter(function(w) {
                        return "errorMarker" == w.type;
                    })[0];
                    oldWidget ? oldWidget.destroy() : row -= dir;
                    var annotations = function(session, row, dir) {
                        var annotations = session.getAnnotations().sort(Range.comparePoints);
                        if (annotations.length) {
                            var i = function(array, needle, comparator) {
                                for(var first = 0, last = array.length - 1; first <= last;){
                                    var mid = first + last >> 1, c = comparator(needle, array[mid]);
                                    if (c > 0) first = mid + 1;
                                    else {
                                        if (!(c < 0)) return mid;
                                        last = mid - 1;
                                    }
                                }
                                return -(first + 1);
                            }(annotations, {
                                row: row,
                                column: -1
                            }, Range.comparePoints);
                            i < 0 && (i = -i - 1), i >= annotations.length ? i = dir > 0 ? 0 : annotations.length - 1 : 0 === i && dir < 0 && (i = annotations.length - 1);
                            var annotation = annotations[i];
                            if (annotation && dir) {
                                if (annotation.row === row) {
                                    do annotation = annotations[i += dir];
                                    while (annotation && annotation.row === row)
                                    if (!annotation) return annotations.slice();
                                }
                                var matched = [];
                                row = annotation.row;
                                do matched[dir < 0 ? "unshift" : "push"](annotation), annotation = annotations[i += dir];
                                while (annotation && annotation.row == row)
                                return matched.length && matched;
                            }
                        }
                    }(session, row, dir);
                    if (annotations) {
                        var annotation = annotations[0];
                        pos.column = (annotation.pos && "number" != typeof annotation.column ? annotation.pos.sc : annotation.column) || 0, pos.row = annotation.row, gutterAnno = editor.renderer.$gutterLayer.$annotations[pos.row];
                    } else {
                        if (oldWidget) return;
                        gutterAnno = {
                            text: [
                                "Looks good!"
                            ],
                            className: "ace_ok"
                        };
                    }
                    editor.session.unfold(pos.row), editor.selection.moveToPosition(pos);
                    var w = {
                        row: pos.row,
                        fixedWidth: !0,
                        coverGutter: !0,
                        el: dom.createElement("div"),
                        type: "errorMarker"
                    }, el = w.el.appendChild(dom.createElement("div")), arrow = w.el.appendChild(dom.createElement("div"));
                    arrow.className = "error_widget_arrow " + gutterAnno.className;
                    var left = editor.renderer.$cursorLayer.getPixelPosition(pos).left;
                    arrow.style.left = left + editor.renderer.gutterWidth - 5 + "px", w.el.className = "error_widget_wrapper", el.className = "error_widget " + gutterAnno.className, el.innerHTML = gutterAnno.text.join("<br>"), el.appendChild(dom.createElement("div"));
                    var kb = function(_, hashId, keyString) {
                        if (0 === hashId && ("esc" === keyString || "return" === keyString)) return w.destroy(), {
                            command: "null"
                        };
                    };
                    w.destroy = function() {
                        editor.$mouseHandler.isMousePressed || (editor.keyBinding.removeKeyboardHandler(kb), session.widgetManager.removeLineWidget(w), editor.off("changeSelection", w.destroy), editor.off("changeSession", w.destroy), editor.off("mouseup", w.destroy), editor.off("change", w.destroy));
                    }, editor.keyBinding.addKeyboardHandler(kb), editor.on("changeSelection", w.destroy), editor.on("changeSession", w.destroy), editor.on("mouseup", w.destroy), editor.on("change", w.destroy), editor.session.widgetManager.addLineWidget(w), w.el.onmousedown = editor.focus.bind(editor), editor.renderer.scrollCursorIntoView(null, 0.5, {
                        bottom: w.el.offsetHeight
                    });
                }, dom.importCssString("\
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
", "error_marker.css", !1);
            }), ace.define("ace/ace", [
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
                "ace/config"
            ], function(require, exports, module) {
                "use strict";
                require("./lib/fixoldbrowsers");
                var dom = require("./lib/dom"), event = require("./lib/event"), Range = require("./range").Range, Editor = require("./editor").Editor, EditSession = require("./edit_session").EditSession, UndoManager = require("./undomanager").UndoManager, Renderer = require("./virtual_renderer").VirtualRenderer;
                require("./worker/worker_client"), require("./keyboard/hash_handler"), require("./placeholder"), require("./multi_select"), require("./mode/folding/fold_mode"), require("./theme/textmate"), require("./ext/error_marker"), exports.config = require("./config"), exports.require = require, exports.define = __webpack_require__.amdD, exports.edit = function(el, options) {
                    if ("string" == typeof el) {
                        var _id = el;
                        if (!(el = document.getElementById(_id))) throw Error("ace.edit can't find div #" + _id);
                    }
                    if (el && el.env && el.env.editor instanceof Editor) return el.env.editor;
                    var value = "";
                    if (el && /input|textarea/i.test(el.tagName)) {
                        var oldNode = el;
                        value = oldNode.value, el = dom.createElement("pre"), oldNode.parentNode.replaceChild(el, oldNode);
                    } else el && (value = el.textContent, el.innerHTML = "");
                    var doc = exports.createEditSession(value), editor = new Editor(new Renderer(el), doc, options), env = {
                        document: doc,
                        editor: editor,
                        onResize: editor.resize.bind(editor, null)
                    };
                    return oldNode && (env.textarea = oldNode), event.addListener(window, "resize", env.onResize), editor.on("destroy", function() {
                        event.removeListener(window, "resize", env.onResize), env.editor.container.env = null;
                    }), editor.container.env = editor.env = env, editor;
                }, exports.createEditSession = function(text, mode) {
                    var doc = new EditSession(text, mode);
                    return doc.setUndoManager(new UndoManager()), doc;
                }, exports.Range = Range, exports.Editor = Editor, exports.EditSession = EditSession, exports.UndoManager = UndoManager, exports.VirtualRenderer = Renderer, exports.version = exports.config.version;
            }), ace.require([
                "ace/ace"
            ], function(a) {
                for(var key in a && (a.config.init(!0), a.define = ace.define), window.ace || (window.ace = a), a)a.hasOwnProperty(key) && (window.ace[key] = a[key]);
                window.ace.default = window.ace, module && (module.exports = window.ace);
            });
        /***/ }
    }
]);
