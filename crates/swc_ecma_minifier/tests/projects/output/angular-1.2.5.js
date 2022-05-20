!function(window1, document1, undefined) {
    "use strict";
    function minErr(module) {
        return function() {
            var obj, message, i, code = arguments[0], template = arguments[1], templateArgs = arguments;
            for(i = 2, message = (message = "[" + (module ? module + ":" : "") + code + "] " + template.replace(/\{\d+\}/g, function(match) {
                var arg, index = +match.slice(1, -1);
                return index + 2 < templateArgs.length ? "function" == typeof (arg = templateArgs[index + 2]) ? arg.toString().replace(/ ?\{[\s\S]*$/, "") : void 0 === arg ? "undefined" : "string" != typeof arg ? toJson(arg) : arg : match;
            })) + "\nhttp://errors.angularjs.org/1.2.5/" + (module ? module + "/" : "") + code; i < arguments.length; i++)message = message + (2 == i ? "?" : "&") + "p" + (i - 2) + "=" + encodeURIComponent((obj = arguments[i], "function" == typeof obj ? obj.toString().replace(/ \{[\s\S]*$/, "") : void 0 === obj ? "undefined" : "string" != typeof obj ? JSON.stringify(obj) : obj));
            return new Error(message);
        };
    }
    var promiseWarning, msie, jqLite, jQuery, angularModule, nodeName_, lowercase = function(string) {
        return isString(string) ? string.toLowerCase() : string;
    }, uppercase = function(string) {
        return isString(string) ? string.toUpperCase() : string;
    }, slice = [].slice, push = [].push, toString = Object.prototype.toString, ngMinErr1 = minErr("ng"), angular1 = (window1.angular, window1.angular || (window1.angular = {})), uid = [
        "0",
        "0",
        "0"
    ];
    function isArrayLike(obj) {
        if (null == obj || isWindow(obj)) return !1;
        var length = obj.length;
        return 1 === obj.nodeType && !!length || isString(obj) || isArray(obj) || 0 === length || "number" == typeof length && length > 0 && length - 1 in obj;
    }
    function forEach(obj, iterator, context) {
        var key;
        if (obj) {
            if (isFunction(obj)) for(key in obj)"prototype" != key && "length" != key && "name" != key && obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
            else if (obj.forEach && obj.forEach !== forEach) obj.forEach(iterator, context);
            else if (isArrayLike(obj)) for(key = 0; key < obj.length; key++)iterator.call(context, obj[key], key);
            else for(key in obj)obj.hasOwnProperty(key) && iterator.call(context, obj[key], key);
        }
        return obj;
    }
    function sortedKeys(obj) {
        var keys = [];
        for(var key in obj)obj.hasOwnProperty(key) && keys.push(key);
        return keys.sort();
    }
    function reverseParams(iteratorFn) {
        return function(value, key) {
            iteratorFn(key, value);
        };
    }
    function nextUid() {
        for(var digit, index = uid.length; index;){
            if (57 == (digit = uid[--index].charCodeAt(0))) return uid[index] = "A", uid.join("");
            if (90 != digit) return uid[index] = String.fromCharCode(digit + 1), uid.join("");
            uid[index] = "0";
        }
        return uid.unshift("0"), uid.join("");
    }
    function setHashKey(obj, h) {
        h ? obj.$$hashKey = h : delete obj.$$hashKey;
    }
    function extend(dst) {
        var h = dst.$$hashKey;
        return forEach(arguments, function(obj) {
            obj !== dst && forEach(obj, function(value, key) {
                dst[key] = value;
            });
        }), setHashKey(dst, h), dst;
    }
    function int(str) {
        return parseInt(str, 10);
    }
    function inherit(parent, extra) {
        return extend(new (extend(function() {}, {
            prototype: parent
        }))(), extra);
    }
    function noop() {}
    function identity($) {
        return $;
    }
    function valueFn1(value) {
        return function() {
            return value;
        };
    }
    function isUndefined(value) {
        return void 0 === value;
    }
    function isDefined(value) {
        return void 0 !== value;
    }
    function isObject(value) {
        return null != value && "object" == typeof value;
    }
    function isString(value) {
        return "string" == typeof value;
    }
    function isNumber(value) {
        return "number" == typeof value;
    }
    function isDate(value) {
        return "[object Date]" === toString.call(value);
    }
    function isArray(value) {
        return "[object Array]" === toString.call(value);
    }
    function isFunction(value) {
        return "function" == typeof value;
    }
    function isRegExp(value) {
        return "[object RegExp]" === toString.call(value);
    }
    function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }
    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }
    msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]), isNaN(msie) && (msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1])), noop.$inject = [], identity.$inject = [];
    var trim1 = String.prototype.trim ? function(value) {
        return isString(value) ? value.trim() : value;
    } : function(value) {
        return isString(value) ? value.replace(/^\s\s*/, "").replace(/\s\s*$/, "") : value;
    };
    function isElement(node) {
        return !!(node && (node.nodeName || node.on && node.find));
    }
    function indexOf(array, obj) {
        if (array.indexOf) return array.indexOf(obj);
        for(var i = 0; i < array.length; i++)if (obj === array[i]) return i;
        return -1;
    }
    function arrayRemove(array, value) {
        var index = indexOf(array, value);
        return index >= 0 && array.splice(index, 1), value;
    }
    function copy(source, destination) {
        if (isWindow(source) || isScope(source)) throw ngMinErr1("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
        if (destination) {
            if (source === destination) throw ngMinErr1("cpi", "Can't copy! Source and destination are identical.");
            if (isArray(source)) {
                destination.length = 0;
                for(var i = 0; i < source.length; i++)destination.push(copy(source[i]));
            } else {
                var h = destination.$$hashKey;
                for(var key1 in forEach(destination, function(value, key) {
                    delete destination[key];
                }), source)destination[key1] = copy(source[key1]);
                setHashKey(destination, h);
            }
        } else destination = source, source && (isArray(source) ? destination = copy(source, []) : isDate(source) ? destination = new Date(source.getTime()) : isRegExp(source) ? destination = new RegExp(source.source) : isObject(source) && (destination = copy(source, {})));
        return destination;
    }
    function equals(o1, o2) {
        if (o1 === o2) return !0;
        if (null === o1 || null === o2) return !1;
        if (o1 != o1 && o2 != o2) return !0;
        var length, key, keySet, t1 = typeof o1;
        if (t1 == typeof o2 && "object" == t1) {
            if (isArray(o1)) {
                if (!isArray(o2)) return !1;
                if ((length = o1.length) == o2.length) {
                    for(key = 0; key < length; key++)if (!equals(o1[key], o2[key])) return !1;
                    return !0;
                }
            } else {
                if (isDate(o1)) return isDate(o2) && o1.getTime() == o2.getTime();
                if (isRegExp(o1) && isRegExp(o2)) return o1.toString() == o2.toString();
                if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return !1;
                for(key in keySet = {}, o1)if (!("$" === key.charAt(0) || isFunction(o1[key]))) {
                    if (!equals(o1[key], o2[key])) return !1;
                    keySet[key] = !0;
                }
                for(key in o2)if (!keySet.hasOwnProperty(key) && "$" !== key.charAt(0) && undefined !== o2[key] && !isFunction(o2[key])) return !1;
                return !0;
            }
        }
        return !1;
    }
    function csp() {
        return document1.securityPolicy && document1.securityPolicy.isActive || document1.querySelector && !!(document1.querySelector("[ng-csp]") || document1.querySelector("[data-ng-csp]"));
    }
    function concat1(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        return !isFunction(fn) || fn instanceof RegExp ? fn : curryArgs.length ? function() {
            return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs);
        } : function() {
            return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
    }
    function toJsonReplacer(key, value) {
        var val = value;
        return "string" == typeof key && "$" === key.charAt(0) ? val = undefined : isWindow(value) ? val = "$WINDOW" : value && document1 === value ? val = "$DOCUMENT" : isScope(value) && (val = "$SCOPE"), val;
    }
    function toJson(obj, pretty) {
        if (void 0 !== obj) return JSON.stringify(obj, toJsonReplacer, pretty ? "  " : null);
    }
    function fromJson(json) {
        return isString(json) ? JSON.parse(json) : json;
    }
    function toBoolean(value) {
        if (value && 0 !== value.length) {
            var v = lowercase("" + value);
            value = !("f" == v || "0" == v || "false" == v || "no" == v || "n" == v || "[]" == v);
        } else value = !1;
        return value;
    }
    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty();
        } catch (e) {}
        var elemHtml = jqLite("<div>").append(element).html();
        try {
            return 3 === element[0].nodeType ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
                return "<" + lowercase(nodeName);
            });
        } catch (e1) {
            return lowercase(elemHtml);
        }
    }
    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {}
    }
    function parseKeyValue(keyValue1) {
        var key_value, key, obj = {};
        return forEach((keyValue1 || "").split("&"), function(keyValue) {
            if (keyValue && (key = tryDecodeURIComponent((key_value = keyValue.split("="))[0]), isDefined(key))) {
                var val = !isDefined(key_value[1]) || tryDecodeURIComponent(key_value[1]);
                obj[key] ? isArray(obj[key]) ? obj[key].push(val) : obj[key] = [
                    obj[key],
                    val
                ] : obj[key] = val;
            }
        }), obj;
    }
    function toKeyValue(obj) {
        var parts = [];
        return forEach(obj, function(value, key) {
            isArray(value) ? forEach(value, function(arrayValue) {
                parts.push(encodeUriQuery(key, !0) + (!0 === arrayValue ? "" : "=" + encodeUriQuery(arrayValue, !0)));
            }) : parts.push(encodeUriQuery(key, !0) + (!0 === value ? "" : "=" + encodeUriQuery(value, !0)));
        }), parts.length ? parts.join("&") : "";
    }
    function encodeUriSegment(val) {
        return encodeUriQuery(val, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
    }
    function bootstrap1(element1, modules) {
        var doBootstrap = function() {
            if ((element1 = jqLite(element1)).injector()) {
                var tag = element1[0] === document1 ? "document" : startingTag(element1);
                throw ngMinErr1("btstrpd", "App Already Bootstrapped with this Element '{0}'", tag);
            }
            (modules = modules || []).unshift([
                "$provide",
                function($provide) {
                    $provide.value("$rootElement", element1);
                }, 
            ]), modules.unshift("ng");
            var injector1 = createInjector(modules);
            return injector1.invoke([
                "$rootScope",
                "$rootElement",
                "$compile",
                "$injector",
                "$animate",
                function(scope, element, compile, injector, animate) {
                    scope.$apply(function() {
                        element.data("$injector", injector), compile(element)(scope);
                    });
                }, 
            ]), injector1;
        }, NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        if (window1 && !NG_DEFER_BOOTSTRAP.test(window1.name)) return doBootstrap();
        window1.name = window1.name.replace(NG_DEFER_BOOTSTRAP, ""), angular1.resumeBootstrap = function(extraModules) {
            forEach(extraModules, function(module) {
                modules.push(module);
            }), doBootstrap();
        };
    }
    nodeName_ = msie < 9 ? function(element) {
        return (element = element.nodeName ? element : element[0]).scopeName && "HTML" != element.scopeName ? uppercase(element.scopeName + ":" + element.nodeName) : element.nodeName;
    } : function(element) {
        return element.nodeName ? element.nodeName : element[0].nodeName;
    };
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        return separator = separator || "_", name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }
    function assertArg(arg, name, reason) {
        if (!arg) throw ngMinErr1("areq", "Argument '{0}' is {1}", name || "?", reason || "required");
        return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
        return acceptArrayAnnotation && isArray(arg) && (arg = arg[arg.length - 1]), assertArg(isFunction(arg), name, "not a function, got " + (arg && "object" == typeof arg ? arg.constructor.name || "Object" : typeof arg)), arg;
    }
    function assertNotHasOwnProperty(name, context) {
        if ("hasOwnProperty" === name) throw ngMinErr1("badname", "hasOwnProperty is not a valid {0} name", context);
    }
    function getter1(obj, path, bindFnToScope) {
        if (!path) return obj;
        for(var key, keys = path.split("."), lastInstance = obj, len = keys.length, i = 0; i < len; i++)key = keys[i], obj && (obj = (lastInstance = obj)[key]);
        return !bindFnToScope && isFunction(obj) ? bind(lastInstance, obj) : obj;
    }
    function getBlockElements(nodes) {
        var startNode = nodes[0], endNode = nodes[nodes.length - 1];
        if (startNode === endNode) return jqLite(startNode);
        var element = startNode, elements = [
            element
        ];
        do {
            if (!(element = element.nextSibling)) break;
            elements.push(element);
        }while (element !== endNode)
        return jqLite(elements);
    }
    var version = {
        full: "1.2.5",
        major: 1,
        minor: 2,
        dot: 5,
        codeName: "singularity-expansion"
    }, jqCache = JQLite.cache = {}, jqName = JQLite.expando = "ng-" + new Date().getTime(), jqId = 1, addEventListenerFn = window1.document.addEventListener ? function(element, type, fn) {
        element.addEventListener(type, fn, !1);
    } : function(element, type, fn) {
        element.attachEvent("on" + type, fn);
    }, removeEventListenerFn = window1.document.removeEventListener ? function(element, type, fn) {
        element.removeEventListener(type, fn, !1);
    } : function(element, type, fn) {
        element.detachEvent("on" + type, fn);
    }, SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g, MOZ_HACK_REGEXP = /^moz([A-Z])/, jqLiteMinErr = minErr("jqLite");
    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).replace(MOZ_HACK_REGEXP, "Moz$1");
    }
    function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
        var originalJqFn = jQuery.fn[name];
        function removePatch(param) {
            var set, setIndex, setLength, element, childIndex, childLength, children, list = filterElems && param ? [
                this.filter(param)
            ] : [
                this
            ], fireEvent = dispatchThis;
            if (!getterIfNoArguments || null != param) for(; list.length;)for(setIndex = 0, setLength = (set = list.shift()).length; setIndex < setLength; setIndex++)for(element = jqLite(set[setIndex]), fireEvent ? element.triggerHandler("$destroy") : fireEvent = !fireEvent, childIndex = 0, childLength = (children = element.children()).length; childIndex < childLength; childIndex++)list.push(jQuery(children[childIndex]));
            return originalJqFn.apply(this, arguments);
        }
        originalJqFn = originalJqFn.$original || originalJqFn, removePatch.$original = originalJqFn, jQuery.fn[name] = removePatch;
    }
    function JQLite(element) {
        if (element instanceof JQLite) return element;
        if (!(this instanceof JQLite)) {
            if (isString(element) && "<" != element.charAt(0)) throw jqLiteMinErr("nosel", "Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element");
            return new JQLite(element);
        }
        if (isString(element)) {
            var div = document1.createElement("div");
            div.innerHTML = "<div>&#160;</div>" + element, div.removeChild(div.firstChild), jqLiteAddNodes(this, div.childNodes), jqLite(document1.createDocumentFragment()).append(this);
        } else jqLiteAddNodes(this, element);
    }
    function jqLiteClone(element) {
        return element.cloneNode(!0);
    }
    function jqLiteDealoc(element) {
        jqLiteRemoveData(element);
        for(var i = 0, children = element.childNodes || []; i < children.length; i++)jqLiteDealoc(children[i]);
    }
    function jqLiteOff(element, type1, fn, unsupported) {
        if (isDefined(unsupported)) throw jqLiteMinErr("offargs", "jqLite#off() does not support the `selector` argument");
        var events = jqLiteExpandoStore(element, "events");
        jqLiteExpandoStore(element, "handle") && (isUndefined(type1) ? forEach(events, function(eventHandler, type) {
            removeEventListenerFn(element, type, eventHandler), delete events[type];
        }) : forEach(type1.split(" "), function(type) {
            isUndefined(fn) ? (removeEventListenerFn(element, type, events[type]), delete events[type]) : arrayRemove(events[type] || [], fn);
        }));
    }
    function jqLiteRemoveData(element, name) {
        var expandoId = element[jqName], expandoStore = jqCache[expandoId];
        if (expandoStore) {
            if (name) {
                delete jqCache[expandoId].data[name];
                return;
            }
            expandoStore.handle && (expandoStore.events.$destroy && expandoStore.handle({}, "$destroy"), jqLiteOff(element)), delete jqCache[expandoId], element[jqName] = undefined;
        }
    }
    function jqLiteExpandoStore(element, key, value) {
        var expandoId = element[jqName], expandoStore = jqCache[expandoId || -1];
        if (!isDefined(value)) return expandoStore && expandoStore[key];
        expandoStore || (element[jqName] = expandoId = ++jqId, expandoStore = jqCache[expandoId] = {}), expandoStore[key] = value;
    }
    function jqLiteData(element, key, value) {
        var data = jqLiteExpandoStore(element, "data"), isSetter = isDefined(value), keyDefined = !isSetter && isDefined(key), isSimpleGetter = keyDefined && !isObject(key);
        if (data || isSimpleGetter || jqLiteExpandoStore(element, "data", data = {}), isSetter) data[key] = value;
        else {
            if (!keyDefined) return data;
            if (isSimpleGetter) return data && data[key];
            extend(data, key);
        }
    }
    function jqLiteHasClass(element, selector) {
        return !!element.getAttribute && (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1;
    }
    function jqLiteRemoveClass(element, cssClasses) {
        cssClasses && element.setAttribute && forEach(cssClasses.split(" "), function(cssClass) {
            element.setAttribute("class", trim1((" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").replace(" " + trim1(cssClass) + " ", " ")));
        });
    }
    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (" " + (element.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(" "), function(cssClass) {
                cssClass = trim1(cssClass), -1 === existingClasses.indexOf(" " + cssClass + " ") && (existingClasses += cssClass + " ");
            }), element.setAttribute("class", trim1(existingClasses));
        }
    }
    function jqLiteAddNodes(root, elements) {
        if (elements) {
            elements = !elements.nodeName && isDefined(elements.length) && !isWindow(elements) ? elements : [
                elements
            ];
            for(var i = 0; i < elements.length; i++)root.push(elements[i]);
        }
    }
    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, "$" + (name || "ngController") + "Controller");
    }
    function jqLiteInheritedData(element, name, value) {
        9 == (element = jqLite(element))[0].nodeType && (element = element.find("html"));
        for(var names = isArray(name) ? name : [
            name
        ]; element.length;){
            for(var i = 0, ii = names.length; i < ii; i++)if (undefined !== (value = element.data(names[i]))) return value;
            element = element.parent();
        }
    }
    function jqLiteEmpty(element) {
        for(var i = 0, childNodes = element.childNodes; i < childNodes.length; i++)jqLiteDealoc(childNodes[i]);
        for(; element.firstChild;)element.removeChild(element.firstChild);
    }
    var JQLitePrototype = JQLite.prototype = {
        ready: function(fn) {
            var fired = !1;
            function trigger() {
                fired || (fired = !0, fn());
            }
            "complete" === document1.readyState ? setTimeout(trigger) : (this.on("DOMContentLoaded", trigger), JQLite(window1).on("load", trigger));
        },
        toString: function() {
            var value = [];
            return forEach(this, function(e) {
                value.push("" + e);
            }), "[" + value.join(", ") + "]";
        },
        eq: function(index) {
            return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
        },
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice
    }, BOOLEAN_ATTR = {};
    forEach("multiple,selected,checked,disabled,readOnly,required,open".split(","), function(value) {
        BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
    }
    function hashKey(obj) {
        var key, objType = typeof obj;
        return "object" == objType && null !== obj ? "function" == typeof (key = obj.$$hashKey) ? key = obj.$$hashKey() : key === undefined && (key = obj.$$hashKey = nextUid()) : key = obj, objType + ":" + key;
    }
    function HashMap(array) {
        forEach(array, this.put, this);
    }
    forEach("input,select,option,textarea,button,form,details".split(","), function(value) {
        BOOLEAN_ELEMENTS[uppercase(value)] = !0;
    }), forEach({
        data: jqLiteData,
        inheritedData: jqLiteInheritedData,
        scope: function(element) {
            return jqLite(element).data("$scope") || jqLiteInheritedData(element.parentNode || element, [
                "$isolateScope",
                "$scope", 
            ]);
        },
        isolateScope: function(element) {
            return jqLite(element).data("$isolateScope") || jqLite(element).data("$isolateScopeNoTemplate");
        },
        controller: jqLiteController,
        injector: function(element) {
            return jqLiteInheritedData(element, "$injector");
        },
        removeAttr: function(element, name) {
            element.removeAttribute(name);
        },
        hasClass: jqLiteHasClass,
        css: function(element, name, value) {
            if (name = camelCase(name), isDefined(value)) element.style[name] = value;
            else {
                var val;
                return msie <= 8 && "" === (val = element.currentStyle && element.currentStyle[name]) && (val = "auto"), val = val || element.style[name], msie <= 8 && (val = "" === val ? undefined : val), val;
            }
        },
        attr: function(element, name, value) {
            var lowercasedName = lowercase(name);
            if (BOOLEAN_ATTR[lowercasedName]) {
                if (!isDefined(value)) return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
                value ? (element[name] = !0, element.setAttribute(name, lowercasedName)) : (element[name] = !1, element.removeAttribute(lowercasedName));
            } else if (isDefined(value)) element.setAttribute(name, value);
            else if (element.getAttribute) {
                var ret = element.getAttribute(name, 2);
                return null === ret ? undefined : ret;
            }
        },
        prop: function(element, name, value) {
            if (!isDefined(value)) return element[name];
            element[name] = value;
        },
        text: function() {
            var NODE_TYPE_TEXT_PROPERTY = [];
            return msie < 9 ? (NODE_TYPE_TEXT_PROPERTY[1] = "innerText", NODE_TYPE_TEXT_PROPERTY[3] = "nodeValue") : NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] = "textContent", getText.$dv = "", getText;
            function getText(element, value) {
                var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
                if (isUndefined(value)) return textProp ? element[textProp] : "";
                element[textProp] = value;
            }
        }(),
        val: function(element, value) {
            if (isUndefined(value)) {
                if ("SELECT" === nodeName_(element) && element.multiple) {
                    var result = [];
                    return forEach(element.options, function(option) {
                        option.selected && result.push(option.value || option.text);
                    }), 0 === result.length ? null : result;
                }
                return element.value;
            }
            element.value = value;
        },
        html: function(element, value) {
            if (isUndefined(value)) return element.innerHTML;
            for(var i = 0, childNodes = element.childNodes; i < childNodes.length; i++)jqLiteDealoc(childNodes[i]);
            element.innerHTML = value;
        },
        empty: jqLiteEmpty
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2) {
            var i, key;
            if (fn !== jqLiteEmpty && (2 == fn.length && fn !== jqLiteHasClass && fn !== jqLiteController ? arg1 : arg2) === undefined) {
                if (isObject(arg1)) {
                    for(i = 0; i < this.length; i++)if (fn === jqLiteData) fn(this[i], arg1);
                    else for(key in arg1)fn(this[i], key, arg1[key]);
                    return this;
                }
                for(var value = fn.$dv, jj = value === undefined ? Math.min(this.length, 1) : this.length, j = 0; j < jj; j++){
                    var nodeValue = fn(this[j], arg1, arg2);
                    value = value ? value + nodeValue : nodeValue;
                }
                return value;
            }
            for(i = 0; i < this.length; i++)fn(this[i], arg1, arg2);
            return this;
        };
    }), forEach({
        removeData: jqLiteRemoveData,
        dealoc: jqLiteDealoc,
        on: function onFn(element, type2, fn1, unsupported) {
            if (isDefined(unsupported)) throw jqLiteMinErr("onargs", "jqLite#on() does not support the `selector` or `eventData` parameters");
            var element2, events, eventHandler, events1 = jqLiteExpandoStore(element, "events"), handle = jqLiteExpandoStore(element, "handle");
            events1 || jqLiteExpandoStore(element, "events", events1 = {}), handle || jqLiteExpandoStore(element, "handle", handle = (element2 = element, events = events1, (eventHandler = function(event, type) {
                if (event.preventDefault || (event.preventDefault = function() {
                    event.returnValue = !1;
                }), event.stopPropagation || (event.stopPropagation = function() {
                    event.cancelBubble = !0;
                }), event.target || (event.target = event.srcElement || document1), isUndefined(event.defaultPrevented)) {
                    var prevent = event.preventDefault;
                    event.preventDefault = function() {
                        event.defaultPrevented = !0, prevent.call(event);
                    }, event.defaultPrevented = !1;
                }
                event.isDefaultPrevented = function() {
                    return event.defaultPrevented || !1 === event.returnValue;
                }, forEach(events[type || event.type], function(fn) {
                    fn.call(element2, event);
                }), msie <= 8 ? (event.preventDefault = null, event.stopPropagation = null, event.isDefaultPrevented = null) : (delete event.preventDefault, delete event.stopPropagation, delete event.isDefaultPrevented);
            }).elem = element2, eventHandler)), forEach(type2.split(" "), function(type) {
                var eventFns = events1[type];
                if (!eventFns) {
                    if ("mouseenter" == type || "mouseleave" == type) {
                        var contains = document1.body.contains || document1.body.compareDocumentPosition ? function(a, b) {
                            var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
                            return a === bup || !!(bup && 1 === bup.nodeType && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(bup)));
                        } : function(a, b) {
                            if (b) {
                                for(; b = b.parentNode;)if (b === a) return !0;
                            }
                            return !1;
                        };
                        events1[type] = [], onFn(element, {
                            mouseleave: "mouseout",
                            mouseenter: "mouseover"
                        }[type], function(event) {
                            var target = this, related = event.relatedTarget;
                            related && (related === target || contains(target, related)) || handle(event, type);
                        });
                    } else addEventListenerFn(element, type, handle), events1[type] = [];
                    eventFns = events1[type];
                }
                eventFns.push(fn1);
            });
        },
        off: jqLiteOff,
        replaceWith: function(element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element), forEach(new JQLite(replaceNode), function(node) {
                index ? parent.insertBefore(node, index.nextSibling) : parent.replaceChild(node, element), index = node;
            });
        },
        children: function(element3) {
            var children = [];
            return forEach(element3.childNodes, function(element) {
                1 === element.nodeType && children.push(element);
            }), children;
        },
        contents: function(element) {
            return element.childNodes || [];
        },
        append: function(element, node) {
            forEach(new JQLite(node), function(child) {
                (1 === element.nodeType || 11 === element.nodeType) && element.appendChild(child);
            });
        },
        prepend: function(element, node) {
            if (1 === element.nodeType) {
                var index = element.firstChild;
                forEach(new JQLite(node), function(child) {
                    element.insertBefore(child, index);
                });
            }
        },
        wrap: function(element, wrapNode) {
            wrapNode = jqLite(wrapNode)[0];
            var parent = element.parentNode;
            parent && parent.replaceChild(wrapNode, element), wrapNode.appendChild(element);
        },
        remove: function(element) {
            jqLiteDealoc(element);
            var parent = element.parentNode;
            parent && parent.removeChild(element);
        },
        after: function(element, newElement) {
            var index = element, parent = element.parentNode;
            forEach(new JQLite(newElement), function(node) {
                parent.insertBefore(node, index.nextSibling), index = node;
            });
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function(element, selector, condition) {
            isUndefined(condition) && (condition = !jqLiteHasClass(element, selector)), (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
        },
        parent: function(element) {
            var parent = element.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null;
        },
        next: function(element) {
            if (element.nextElementSibling) return element.nextElementSibling;
            for(var elm = element.nextSibling; null != elm && 1 !== elm.nodeType;)elm = elm.nextSibling;
            return elm;
        },
        find: function(element, selector) {
            return element.getElementsByTagName ? element.getElementsByTagName(selector) : [];
        },
        clone: jqLiteClone,
        triggerHandler: function(element, eventName, eventData) {
            var eventFns = (jqLiteExpandoStore(element, "events") || {})[eventName];
            eventData = eventData || [];
            var event = [
                {
                    preventDefault: noop,
                    stopPropagation: noop
                }, 
            ];
            forEach(eventFns, function(fn) {
                fn.apply(element, event.concat(eventData));
            });
        }
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2, arg3) {
            for(var value, i = 0; i < this.length; i++)isUndefined(value) ? isDefined(value = fn(this[i], arg1, arg2, arg3)) && (value = jqLite(value)) : jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
            return isDefined(value) ? value : this;
        }, JQLite.prototype.bind = JQLite.prototype.on, JQLite.prototype.unbind = JQLite.prototype.off;
    }), HashMap.prototype = {
        put: function(key, value) {
            this[hashKey(key)] = value;
        },
        get: function(key) {
            return this[hashKey(key)];
        },
        remove: function(key) {
            var value = this[key = hashKey(key)];
            return delete this[key], value;
        }
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /^\s*(_?)(\S+?)\1\s*$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, $injectorMinErr1 = minErr("$injector");
    function annotate(fn) {
        var $inject, last;
        return "function" == typeof fn ? ($inject = fn.$inject) || ($inject = [], fn.length && forEach(fn.toString().replace(STRIP_COMMENTS, "").match(FN_ARGS)[1].split(FN_ARG_SPLIT), function(arg) {
            arg.replace(FN_ARG, function(all, underscore, name) {
                $inject.push(name);
            });
        }), fn.$inject = $inject) : isArray(fn) ? (last = fn.length - 1, assertArgFn(fn[last], "fn"), $inject = fn.slice(0, last)) : assertArgFn(fn, "fn", !0), $inject;
    }
    function createInjector(modulesToLoad1) {
        var INSTANTIATING = {}, providerSuffix = "Provider", path = [], loadedModules = new HashMap(), providerCache = {
            $provide: {
                provider: supportObject(provider1),
                factory: supportObject(factory1),
                service: supportObject(function(name, constructor) {
                    return factory1(name, [
                        "$injector",
                        function($injector) {
                            return $injector.instantiate(constructor);
                        }, 
                    ]);
                }),
                value: supportObject(function(name, val) {
                    return factory1(name, valueFn1(val));
                }),
                constant: supportObject(function(name, value) {
                    assertNotHasOwnProperty(name, "constant"), providerCache[name] = value, instanceCache[name] = value;
                }),
                decorator: function(serviceName, decorFn) {
                    var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
                    origProvider.$get = function() {
                        var origInstance = instanceInjector.invoke(orig$get, origProvider);
                        return instanceInjector.invoke(decorFn, null, {
                            $delegate: origInstance
                        });
                    };
                }
            }
        }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function() {
            throw $injectorMinErr1("unpr", "Unknown provider: {0}", path.join(" <- "));
        }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
        });
        return forEach(loadModules(modulesToLoad1), function(fn) {
            instanceInjector.invoke(fn || noop);
        }), instanceInjector;
        function supportObject(delegate) {
            return function(key, value) {
                if (!isObject(key)) return delegate(key, value);
                forEach(key, reverseParams(delegate));
            };
        }
        function provider1(name, provider_) {
            if (assertNotHasOwnProperty(name, "service"), (isFunction(provider_) || isArray(provider_)) && (provider_ = providerInjector.instantiate(provider_)), !provider_.$get) throw $injectorMinErr1("pget", "Provider '{0}' must define $get factory method.", name);
            return providerCache[name + providerSuffix] = provider_;
        }
        function factory1(name, factoryFn) {
            return provider1(name, {
                $get: factoryFn
            });
        }
        function loadModules(modulesToLoad) {
            var moduleFn, invokeQueue, i, ii, runBlocks = [];
            return forEach(modulesToLoad, function(module) {
                if (!loadedModules.get(module)) {
                    loadedModules.put(module, !0);
                    try {
                        if (isString(module)) for(moduleFn = angularModule(module), runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks), invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++){
                            var invokeArgs = invokeQueue[i], provider = providerInjector.get(invokeArgs[0]);
                            provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                        }
                        else isFunction(module) ? runBlocks.push(providerInjector.invoke(module)) : isArray(module) ? runBlocks.push(providerInjector.invoke(module)) : assertArgFn(module, "module");
                    } catch (e) {
                        throw isArray(module) && (module = module[module.length - 1]), e.message && e.stack && -1 == e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), $injectorMinErr1("modulerr", "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
                    }
                }
            }), runBlocks;
        }
        function createInternalInjector(cache, factory) {
            function getService(serviceName) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING) throw $injectorMinErr1("cdep", "Circular dependency found: {0}", path.join(" <- "));
                    return cache[serviceName];
                }
                try {
                    return path.unshift(serviceName), cache[serviceName] = INSTANTIATING, cache[serviceName] = factory(serviceName);
                } finally{
                    path.shift();
                }
            }
            function invoke(fn, self, locals) {
                var length, i, key, args = [], $inject = annotate(fn);
                for(i = 0, length = $inject.length; i < length; i++){
                    if ("string" != typeof (key = $inject[i])) throw $injectorMinErr1("itkn", "Incorrect injection token! Expected service name as string, got {0}", key);
                    args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key));
                }
                return fn.$inject || (fn = fn[length]), fn.apply(self, args);
            }
            return {
                invoke: invoke,
                instantiate: function(Type, locals) {
                    var instance, returnedValue, Constructor = function() {};
                    return Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype, returnedValue = invoke(Type, instance = new Constructor(), locals), isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
                },
                get: getService,
                annotate: annotate,
                has: function(name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
                }
            };
        }
    }
    function $AnchorScrollProvider() {
        var autoScrollingEnabled = !0;
        this.disableAutoScrolling = function() {
            autoScrollingEnabled = !1;
        }, this.$get = [
            "$window",
            "$location",
            "$rootScope",
            function($window, $location, $rootScope) {
                var document = $window.document;
                function scroll() {
                    var list, result, elm, hash = $location.hash();
                    hash ? (elm = document.getElementById(hash)) ? elm.scrollIntoView() : (elm = (list = document.getElementsByName(hash), result = null, forEach(list, function(element) {
                        result || "a" !== lowercase(element.nodeName) || (result = element);
                    }), result)) ? elm.scrollIntoView() : "top" === hash && $window.scrollTo(0, 0) : $window.scrollTo(0, 0);
                }
                return autoScrollingEnabled && $rootScope.$watch(function() {
                    return $location.hash();
                }, function() {
                    $rootScope.$evalAsync(scroll);
                }), scroll;
            }, 
        ];
    }
    var $animateMinErr = minErr("$animate"), $AnimateProvider = [
        "$provide",
        function($provide) {
            this.$$selectors = {}, this.register = function(name, factory) {
                var key = name + "-animation";
                if (name && "." != name.charAt(0)) throw $animateMinErr("notcsel", "Expecting class selector starting with '.' got '{0}'.", name);
                this.$$selectors[name.substr(1)] = key, $provide.factory(key, factory);
            }, this.$get = [
                "$timeout",
                function($timeout) {
                    return {
                        enter: function(element, parent, after, done) {
                            after ? after.after(element) : (parent && parent[0] || (parent = after.parent()), parent.append(element)), done && $timeout(done, 0, !1);
                        },
                        leave: function(element, done) {
                            element.remove(), done && $timeout(done, 0, !1);
                        },
                        move: function(element, parent, after, done) {
                            this.enter(element, parent, after, done);
                        },
                        addClass: function(element4, className, done) {
                            className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element4, function(element) {
                                jqLiteAddClass(element, className);
                            }), done && $timeout(done, 0, !1);
                        },
                        removeClass: function(element5, className, done) {
                            className = isString(className) ? className : isArray(className) ? className.join(" ") : "", forEach(element5, function(element) {
                                jqLiteRemoveClass(element, className);
                            }), done && $timeout(done, 0, !1);
                        },
                        enabled: noop
                    };
                }, 
            ];
        }, 
    ];
    function Browser(window, document, $log, $sniffer) {
        var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout1 = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
        self.isMock = !1;
        var outstandingRequestCount = 0, outstandingRequestCallbacks = [];
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1));
            } finally{
                if (0 == --outstandingRequestCount) for(; outstandingRequestCallbacks.length;)try {
                    outstandingRequestCallbacks.pop()();
                } catch (e) {
                    $log.error(e);
                }
            }
        }
        self.$$completeOutstandingRequest = completeOutstandingRequest, self.$$incOutstandingRequestCount = function() {
            outstandingRequestCount++;
        }, self.notifyWhenNoOutstandingRequests = function(callback) {
            forEach(pollFns, function(pollFn) {
                pollFn();
            }), 0 === outstandingRequestCount ? callback() : outstandingRequestCallbacks.push(callback);
        };
        var pollTimeout, pollFns = [];
        self.addPollFn = function(fn) {
            var interval, setTimeout;
            return isUndefined(pollTimeout) && (setTimeout = setTimeout1, forEach(pollFns, function(pollFn) {
                pollFn();
            }), pollTimeout = setTimeout(check, 100)), pollFns.push(fn), fn;
        };
        var lastBrowserUrl = location.href, baseElement = document.find("base"), newLocation = null;
        self.url = function(url, replace) {
            return (location !== window.location && (location = window.location), url) ? lastBrowserUrl != url ? (lastBrowserUrl = url, $sniffer.history ? replace ? history.replaceState(null, "", url) : (history.pushState(null, "", url), baseElement.attr("href", baseElement.attr("href"))) : (newLocation = url, replace ? location.replace(url) : location.href = url), self) : void 0 : newLocation || location.href.replace(/%27/g, "'");
        };
        var urlChangeListeners = [], urlChangeInit = !1;
        function fireUrlChange() {
            newLocation = null, lastBrowserUrl != self.url() && (lastBrowserUrl = self.url(), forEach(urlChangeListeners, function(listener) {
                listener(self.url());
            }));
        }
        self.onUrlChange = function(callback) {
            return urlChangeInit || ($sniffer.history && jqLite(window).on("popstate", fireUrlChange), $sniffer.hashchange ? jqLite(window).on("hashchange", fireUrlChange) : self.addPollFn(fireUrlChange), urlChangeInit = !0), urlChangeListeners.push(callback), callback;
        }, self.baseHref = function() {
            var href = baseElement.attr("href");
            return href ? href.replace(/^https?\:\/\/[^\/]*/, "") : "";
        };
        var lastCookies = {}, lastCookieString = "", cookiePath = self.baseHref();
        self.cookies = function(name, value) {
            var cookieLength, cookieArray, cookie, i, index;
            if (name) value === undefined ? rawDocument.cookie = escape(name) + "=;path=" + cookiePath + ";expires=Thu, 01 Jan 1970 00:00:00 GMT" : isString(value) && (cookieLength = (rawDocument.cookie = escape(name) + "=" + escape(value) + ";path=" + cookiePath).length + 1) > 4096 && $log.warn("Cookie '" + name + "' possibly not set or overflowed because it was too large (" + cookieLength + " > 4096 bytes)!");
            else {
                if (rawDocument.cookie !== lastCookieString) for(i = 0, cookieArray = (lastCookieString = rawDocument.cookie).split("; "), lastCookies = {}; i < cookieArray.length; i++)(index = (cookie = cookieArray[i]).indexOf("=")) > 0 && undefined === lastCookies[name = unescape(cookie.substring(0, index))] && (lastCookies[name] = unescape(cookie.substring(index + 1)));
                return lastCookies;
            }
        }, self.defer = function(fn, delay) {
            var timeoutId;
            return outstandingRequestCount++, pendingDeferIds[timeoutId = setTimeout1(function() {
                delete pendingDeferIds[timeoutId], completeOutstandingRequest(fn);
            }, delay || 0)] = !0, timeoutId;
        }, self.defer.cancel = function(deferId) {
            return !!pendingDeferIds[deferId] && (delete pendingDeferIds[deferId], clearTimeout(deferId), completeOutstandingRequest(noop), !0);
        };
    }
    function $BrowserProvider() {
        this.$get = [
            "$window",
            "$log",
            "$sniffer",
            "$document",
            function($window, $log, $sniffer, $document) {
                return new Browser($window, $document, $log, $sniffer);
            }, 
        ];
    }
    function $CacheFactoryProvider() {
        this.$get = function() {
            var caches = {};
            function cacheFactory(cacheId, options) {
                if (cacheId in caches) throw minErr("$cacheFactory")("iid", "CacheId '{0}' is already taken!", cacheId);
                var size = 0, stats = extend({}, options, {
                    id: cacheId
                }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
                return caches[cacheId] = {
                    put: function(key, value) {
                        if (refresh(lruHash[key] || (lruHash[key] = {
                            key: key
                        })), !isUndefined(value)) return !(key in data) && size++, data[key] = value, size > capacity && this.remove(staleEnd.key), value;
                    },
                    get: function(key) {
                        var lruEntry = lruHash[key];
                        if (lruEntry) return refresh(lruEntry), data[key];
                    },
                    remove: function(key) {
                        var lruEntry = lruHash[key];
                        lruEntry && (lruEntry == freshEnd && (freshEnd = lruEntry.p), lruEntry == staleEnd && (staleEnd = lruEntry.n), link(lruEntry.n, lruEntry.p), delete lruHash[key], delete data[key], size--);
                    },
                    removeAll: function() {
                        data = {}, size = 0, lruHash = {}, freshEnd = staleEnd = null;
                    },
                    destroy: function() {
                        data = null, stats = null, lruHash = null, delete caches[cacheId];
                    },
                    info: function() {
                        return extend({}, stats, {
                            size: size
                        });
                    }
                };
                function refresh(entry) {
                    entry != freshEnd && (staleEnd ? staleEnd == entry && (staleEnd = entry.n) : staleEnd = entry, link(entry.n, entry.p), link(entry, freshEnd), (freshEnd = entry).n = null);
                }
                function link(nextEntry, prevEntry) {
                    nextEntry != prevEntry && (nextEntry && (nextEntry.p = prevEntry), prevEntry && (prevEntry.n = nextEntry));
                }
            }
            return cacheFactory.info = function() {
                var info = {};
                return forEach(caches, function(cache, cacheId) {
                    info[cacheId] = cache.info();
                }), info;
            }, cacheFactory.get = function(cacheId) {
                return caches[cacheId];
            }, cacheFactory;
        };
    }
    function $TemplateCacheProvider() {
        this.$get = [
            "$cacheFactory",
            function($cacheFactory) {
                return $cacheFactory("templates");
            }, 
        ];
    }
    var $compileMinErr = minErr("$compile");
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        var hasDirectives = {}, Suffix = "Directive", COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/, EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
        this.directive = function registerDirective(name, directiveFactory1) {
            return assertNotHasOwnProperty(name, "directive"), isString(name) ? (assertArg(directiveFactory1, "directiveFactory"), hasDirectives.hasOwnProperty(name) || (hasDirectives[name] = [], $provide.factory(name + Suffix, [
                "$injector",
                "$exceptionHandler",
                function($injector, $exceptionHandler) {
                    var directives = [];
                    return forEach(hasDirectives[name], function(directiveFactory, index) {
                        try {
                            var directive = $injector.invoke(directiveFactory);
                            isFunction(directive) ? directive = {
                                compile: valueFn1(directive)
                            } : !directive.compile && directive.link && (directive.compile = valueFn1(directive.link)), directive.priority = directive.priority || 0, directive.index = index, directive.name = directive.name || name, directive.require = directive.require || directive.controller && directive.name, directive.restrict = directive.restrict || "A", directives.push(directive);
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    }), directives;
                }, 
            ])), hasDirectives[name].push(directiveFactory1)) : forEach(name, reverseParams(registerDirective)), this;
        }, this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? ($$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp), this) : $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }, this.$get = [
            "$injector",
            "$interpolate",
            "$exceptionHandler",
            "$http",
            "$templateCache",
            "$parse",
            "$controller",
            "$rootScope",
            "$document",
            "$sce",
            "$animate",
            "$$sanitizeUri",
            function($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
                var Attributes = function(element, attr) {
                    this.$$element = element, this.$attr = attr || {};
                };
                Attributes.prototype = {
                    $normalize: directiveNormalize,
                    $addClass: function(classVal) {
                        classVal && classVal.length > 0 && $animate.addClass(this.$$element, classVal);
                    },
                    $removeClass: function(classVal) {
                        classVal && classVal.length > 0 && $animate.removeClass(this.$$element, classVal);
                    },
                    $updateClass: function(newClasses, oldClasses) {
                        this.$removeClass(tokenDifference(oldClasses, newClasses)), this.$addClass(tokenDifference(newClasses, oldClasses));
                    },
                    $set: function(key, value, writeAttr, attrName) {
                        var nodeName, booleanKey = getBooleanAttrName(this.$$element[0], key);
                        booleanKey && (this.$$element.prop(key, value), attrName = booleanKey), this[key] = value, attrName ? this.$attr[key] = attrName : (attrName = this.$attr[key]) || (this.$attr[key] = attrName = snake_case(key, "-")), ("A" === (nodeName = nodeName_(this.$$element)) && "href" === key || "IMG" === nodeName && "src" === key) && (this[key] = value = $$sanitizeUri(value, "src" === key)), !1 !== writeAttr && (null === value || value === undefined ? this.$$element.removeAttr(attrName) : this.$$element.attr(attrName, value));
                        var $$observers = this.$$observers;
                        $$observers && forEach($$observers[key], function(fn) {
                            try {
                                fn(value);
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        });
                    },
                    $observe: function(key, fn) {
                        var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = {}), listeners = $$observers[key] || ($$observers[key] = []);
                        return listeners.push(fn), $rootScope.$evalAsync(function() {
                            listeners.$$inter || fn(attrs[key]);
                        }), fn;
                    }
                };
                var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = "{{" == startSymbol || "}}" == endSymbol ? identity : function(template) {
                    return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
                }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
                return compile;
                function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
                    $compileNodes instanceof jqLite || ($compileNodes = jqLite($compileNodes)), forEach($compileNodes, function(node, index) {
                        3 == node.nodeType && node.nodeValue.match(/\S+/) && ($compileNodes[index] = node = jqLite(node).wrap("<span></span>").parent()[0]);
                    });
                    var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
                    return function(scope, cloneConnectFn, transcludeControllers) {
                        assertArg(scope, "scope");
                        var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes;
                        forEach(transcludeControllers, function(instance, name) {
                            $linkNode.data("$" + name + "Controller", instance);
                        });
                        for(var i = 0, ii = $linkNode.length; i < ii; i++){
                            var node = $linkNode[i];
                            (1 == node.nodeType || 9 == node.nodeType) && $linkNode.eq(i).data("$scope", scope);
                        }
                        return safeAddClass($linkNode, "ng-scope"), cloneConnectFn && cloneConnectFn($linkNode, scope), compositeLinkFn && compositeLinkFn(scope, $linkNode, $linkNode), $linkNode;
                    };
                }
                function safeAddClass($element, className) {
                    try {
                        $element.addClass(className);
                    } catch (e) {}
                }
                function compileNodes(nodeList1, transcludeFn, $rootElement1, maxPriority, ignoreDirective, previousCompileContext) {
                    for(var nodeLinkFn1, childLinkFn1, directives, attrs, linkFnFound, linkFns = [], i1 = 0; i1 < nodeList1.length; i1++)attrs = new Attributes(), childLinkFn1 = (nodeLinkFn1 = (directives = collectDirectives(nodeList1[i1], [], attrs, 0 === i1 ? maxPriority : undefined, ignoreDirective)).length ? applyDirectivesToNode(directives, nodeList1[i1], attrs, transcludeFn, $rootElement1, null, [], [], previousCompileContext) : null) && nodeLinkFn1.terminal || !nodeList1[i1].childNodes || !nodeList1[i1].childNodes.length ? null : compileNodes(nodeList1[i1].childNodes, nodeLinkFn1 ? nodeLinkFn1.transclude : transcludeFn), linkFns.push(nodeLinkFn1), linkFns.push(childLinkFn1), linkFnFound = linkFnFound || nodeLinkFn1 || childLinkFn1, previousCompileContext = null;
                    return linkFnFound ? function(scope, nodeList, $rootElement, boundTranscludeFn) {
                        var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n, stableNodeList = [];
                        for(i = 0, ii = nodeList.length; i < ii; i++)stableNodeList.push(nodeList[i]);
                        for(i = 0, n = 0, ii = linkFns.length; i < ii; n++)node = stableNodeList[n], nodeLinkFn = linkFns[i++], childLinkFn = linkFns[i++], $node = jqLite(node), nodeLinkFn ? (nodeLinkFn.scope ? (childScope = scope.$new(), $node.data("$scope", childScope), safeAddClass($node, "ng-scope")) : childScope = scope, childTranscludeFn = nodeLinkFn.transclude, nodeLinkFn(childLinkFn, childScope, node, $rootElement, childTranscludeFn || !boundTranscludeFn && transcludeFn ? createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn) : boundTranscludeFn)) : childLinkFn && childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
                    } : null;
                }
                function createBoundTranscludeFn(scope, transcludeFn) {
                    return function(transcludedScope, cloneFn, controllers) {
                        var scopeCreated = !1;
                        transcludedScope || ((transcludedScope = scope.$new()).$$transcluded = !0, scopeCreated = !0);
                        var clone = transcludeFn(transcludedScope, cloneFn, controllers);
                        return scopeCreated && clone.on("$destroy", bind(transcludedScope, transcludedScope.$destroy)), clone;
                    };
                }
                function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                    var match, className, nodeType = node.nodeType, attrsMap = attrs.$attr;
                    switch(nodeType){
                        case 1:
                            addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), "E", maxPriority, ignoreDirective);
                            for(var attr, name, nName, ngAttrName, value, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++){
                                var attrStartName = !1, attrEndName = !1;
                                if (attr = nAttrs[j], !msie || msie >= 8 || attr.specified) {
                                    ngAttrName = directiveNormalize(name = attr.name), NG_ATTR_BINDING.test(ngAttrName) && (name = snake_case(ngAttrName.substr(6), "-"));
                                    var directiveNName = ngAttrName.replace(/(Start|End)$/, "");
                                    ngAttrName === directiveNName + "Start" && (attrStartName = name, attrEndName = name.substr(0, name.length - 5) + "end", name = name.substr(0, name.length - 6)), attrsMap[nName = directiveNormalize(name.toLowerCase())] = name, attrs[nName] = value = trim1(msie && "href" == name ? decodeURIComponent(node.getAttribute(name, 2)) : attr.value), getBooleanAttrName(node, nName) && (attrs[nName] = !0), addAttrInterpolateDirective(node, directives, value, nName), addDirective(directives, nName, "A", maxPriority, ignoreDirective, attrStartName, attrEndName);
                                }
                            }
                            if (isString(className = node.className) && "" !== className) for(; match = CLASS_DIRECTIVE_REGEXP.exec(className);)addDirective(directives, nName = directiveNormalize(match[2]), "C", maxPriority, ignoreDirective) && (attrs[nName] = trim1(match[3])), className = className.substr(match.index + match[0].length);
                            break;
                        case 3:
                            addTextInterpolateDirective(directives, node.nodeValue);
                            break;
                        case 8:
                            try {
                                (match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue)) && (nName = directiveNormalize(match[1]), addDirective(directives, nName, "M", maxPriority, ignoreDirective) && (attrs[nName] = trim1(match[2])));
                            } catch (e) {}
                    }
                    return directives.sort(byPriority), directives;
                }
                function groupScan(node, attrStart, attrEnd) {
                    var nodes = [], depth = 0;
                    if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) do {
                        if (!node) throw $compileMinErr("uterdir", "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
                        1 == node.nodeType && (node.hasAttribute(attrStart) && depth++, node.hasAttribute(attrEnd) && depth--), nodes.push(node), node = node.nextSibling;
                    }while (depth > 0)
                    else nodes.push(node);
                    return jqLite(nodes);
                }
                function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                    return function(scope, element, attrs, controllers, transcludeFn) {
                        return element = groupScan(element[0], attrStart, attrEnd), linkFn(scope, element, attrs, controllers, transcludeFn);
                    };
                }
                function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn1, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
                    previousCompileContext = previousCompileContext || {};
                    for(var newScopeDirective, directive1, directiveName, $template, linkFn1, directiveValue, terminalPriority = -Number.MAX_VALUE, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = !1, hasElementTranscludeDirective = !1, $compileNode = templateAttrs.$$element = jqLite(compileNode), replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn1, i2 = 0, ii1 = directives.length; i2 < ii1; i2++){
                        var attrStart = (directive1 = directives[i2]).$$start, attrEnd = directive1.$$end;
                        if (attrStart && ($compileNode = groupScan(compileNode, attrStart, attrEnd)), $template = undefined, terminalPriority > directive1.priority) break;
                        if ((directiveValue = directive1.scope) && (newScopeDirective = newScopeDirective || directive1, !directive1.templateUrl && (assertNoDuplicate("new/isolated scope", newIsolateScopeDirective, directive1, $compileNode), isObject(directiveValue) && (newIsolateScopeDirective = directive1))), directiveName = directive1.name, !directive1.templateUrl && directive1.controller && (directiveValue = directive1.controller, assertNoDuplicate("'" + directiveName + "' controller", (controllerDirectives = controllerDirectives || {})[directiveName], directive1, $compileNode), controllerDirectives[directiveName] = directive1), (directiveValue = directive1.transclude) && (hasTranscludeDirective = !0, directive1.$$tlb || (assertNoDuplicate("transclusion", nonTlbTranscludeDirective, directive1, $compileNode), nonTlbTranscludeDirective = directive1), "element" == directiveValue ? (hasElementTranscludeDirective = !0, terminalPriority = directive1.priority, $template = groupScan(compileNode, attrStart, attrEnd), compileNode = ($compileNode = templateAttrs.$$element = jqLite(document1.createComment(" " + directiveName + ": " + templateAttrs[directiveName] + " ")))[0], replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode), childTranscludeFn = compile($template, transcludeFn1, terminalPriority, replaceDirective && replaceDirective.name, {
                            nonTlbTranscludeDirective: nonTlbTranscludeDirective
                        })) : ($template = jqLite(jqLiteClone(compileNode)).contents(), $compileNode.empty(), childTranscludeFn = compile($template, transcludeFn1))), directive1.template) if (assertNoDuplicate("template", templateDirective, directive1, $compileNode), templateDirective = directive1, directiveValue = isFunction(directive1.template) ? directive1.template($compileNode, templateAttrs) : directive1.template, directiveValue = denormalizeTemplate(directiveValue), directive1.replace) {
                            if (replaceDirective = directive1, compileNode = ($template = jqLite("<div>" + trim1(directiveValue) + "</div>").contents())[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", directiveName, "");
                            replaceWith(jqCollection, $compileNode, compileNode);
                            var newTemplateAttrs = {
                                $attr: {}
                            }, templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs), unprocessedDirectives = directives.splice(i2 + 1, directives.length - (i2 + 1));
                            newIsolateScopeDirective && markDirectivesAsIsolate(templateDirectives), directives = directives.concat(templateDirectives).concat(unprocessedDirectives), mergeTemplateAttributes(templateAttrs, newTemplateAttrs), ii1 = directives.length;
                        } else $compileNode.html(directiveValue);
                        if (directive1.templateUrl) assertNoDuplicate("template", templateDirective, directive1, $compileNode), templateDirective = directive1, directive1.replace && (replaceDirective = directive1), nodeLinkFn = compileTemplateUrl(directives.splice(i2, directives.length - i2), $compileNode, templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                            controllerDirectives: controllerDirectives,
                            newIsolateScopeDirective: newIsolateScopeDirective,
                            templateDirective: templateDirective,
                            nonTlbTranscludeDirective: nonTlbTranscludeDirective
                        }), ii1 = directives.length;
                        else if (directive1.compile) try {
                            linkFn1 = directive1.compile($compileNode, templateAttrs, childTranscludeFn), isFunction(linkFn1) ? addLinkFns(null, linkFn1, attrStart, attrEnd) : linkFn1 && addLinkFns(linkFn1.pre, linkFn1.post, attrStart, attrEnd);
                        } catch (e) {
                            $exceptionHandler(e, startingTag($compileNode));
                        }
                        directive1.terminal && (nodeLinkFn.terminal = !0, terminalPriority = Math.max(terminalPriority, directive1.priority));
                    }
                    return nodeLinkFn.scope = newScopeDirective && !0 === newScopeDirective.scope, nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn, nodeLinkFn;
                    function addLinkFns(pre, post, attrStart, attrEnd) {
                        pre && (attrStart && (pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd)), pre.require = directive1.require, (newIsolateScopeDirective === directive1 || directive1.$$isolateScope) && (pre = cloneAndAnnotateFn(pre, {
                            isolateScope: !0
                        })), preLinkFns.push(pre)), post && (attrStart && (post = groupElementsLinkFnWrapper(post, attrStart, attrEnd)), post.require = directive1.require, (newIsolateScopeDirective === directive1 || directive1.$$isolateScope) && (post = cloneAndAnnotateFn(post, {
                            isolateScope: !0
                        })), postLinkFns.push(post));
                    }
                    function getControllers(require1, $element, elementControllers) {
                        var value, retrievalMethod = "data", optional = !1;
                        if (isString(require1)) {
                            for(; "^" == (value = require1.charAt(0)) || "?" == value;)require1 = require1.substr(1), "^" == value && (retrievalMethod = "inheritedData"), optional = optional || "?" == value;
                            if (value = null, elementControllers && "data" === retrievalMethod && (value = elementControllers[require1]), !(value = value || $element[retrievalMethod]("$" + require1 + "Controller")) && !optional) throw $compileMinErr("ctreq", "Controller '{0}', required by directive '{1}', can't be found!", require1, directiveName);
                        } else isArray(require1) && (value = [], forEach(require1, function(require) {
                            value.push(getControllers(require, $element, elementControllers));
                        }));
                        return value;
                    }
                    function nodeLinkFn(childLinkFn, scope1, linkNode, $rootElement, boundTranscludeFn) {
                        var attrs, $element, i, ii, linkFn, controller, isolateScope, transcludeFn, elementControllers = {};
                        if ($element = (attrs = compileNode === linkNode ? templateAttrs : function(src, dst) {
                            for(var key in dst = dst || {}, src)src.hasOwnProperty(key) && "$$" !== key.substr(0, 2) && (dst[key] = src[key]);
                            return dst;
                        }(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr))).$$element, newIsolateScopeDirective) {
                            var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/, $linkNode = jqLite(linkNode);
                            isolateScope = scope1.$new(!0), templateDirective && templateDirective === newIsolateScopeDirective.$$originalDirective ? $linkNode.data("$isolateScope", isolateScope) : $linkNode.data("$isolateScopeNoTemplate", isolateScope), safeAddClass($linkNode, "ng-isolate-scope"), forEach(newIsolateScopeDirective.scope, function(definition, scopeName) {
                                var lastValue, parentGet, parentSet, compare, match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, optional = "?" == match[2], mode = match[1];
                                switch(isolateScope.$$isolateBindings[scopeName] = mode + attrName, mode){
                                    case "@":
                                        attrs.$observe(attrName, function(value) {
                                            isolateScope[scopeName] = value;
                                        }), attrs.$$observers[attrName].$$scope = scope1, attrs[attrName] && (isolateScope[scopeName] = $interpolate(attrs[attrName])(scope1));
                                        break;
                                    case "=":
                                        if (optional && !attrs[attrName]) return;
                                        compare = (parentGet = $parse(attrs[attrName])).literal ? equals : function(a, b) {
                                            return a === b;
                                        }, parentSet = parentGet.assign || function() {
                                            throw lastValue = isolateScope[scopeName] = parentGet(scope1), $compileMinErr("nonassign", "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], newIsolateScopeDirective.name);
                                        }, lastValue = isolateScope[scopeName] = parentGet(scope1), isolateScope.$watch(function() {
                                            var parentValue = parentGet(scope1);
                                            return compare(parentValue, isolateScope[scopeName]) || (compare(parentValue, lastValue) ? parentSet(scope1, parentValue = isolateScope[scopeName]) : isolateScope[scopeName] = parentValue), lastValue = parentValue;
                                        }, null, parentGet.literal);
                                        break;
                                    case "&":
                                        parentGet = $parse(attrs[attrName]), isolateScope[scopeName] = function(locals) {
                                            return parentGet(scope1, locals);
                                        };
                                        break;
                                    default:
                                        throw $compileMinErr("iscp", "Invalid isolate scope definition for directive '{0}'. Definition: {... {1}: '{2}' ...}", newIsolateScopeDirective.name, scopeName, definition);
                                }
                            });
                        }
                        for(transcludeFn = boundTranscludeFn && function(scope, cloneAttachFn) {
                            var transcludeControllers;
                            return arguments.length < 2 && (cloneAttachFn = scope, scope = undefined), hasElementTranscludeDirective && (transcludeControllers = elementControllers), boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
                        }, controllerDirectives && forEach(controllerDirectives, function(directive) {
                            var controllerInstance, locals = {
                                $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope1,
                                $element: $element,
                                $attrs: attrs,
                                $transclude: transcludeFn
                            };
                            "@" == (controller = directive.controller) && (controller = attrs[directive.name]), controllerInstance = $controller(controller, locals), elementControllers[directive.name] = controllerInstance, hasElementTranscludeDirective || $element.data("$" + directive.name + "Controller", controllerInstance), directive.controllerAs && (locals.$scope[directive.controllerAs] = controllerInstance);
                        }), i = 0, ii = preLinkFns.length; i < ii; i++)try {
                            (linkFn = preLinkFns[i])(linkFn.isolateScope ? isolateScope : scope1, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                        } catch (e) {
                            $exceptionHandler(e, startingTag($element));
                        }
                        var scopeToChild = scope1;
                        for(newIsolateScopeDirective && (newIsolateScopeDirective.template || null === newIsolateScopeDirective.templateUrl) && (scopeToChild = isolateScope), childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn), i = postLinkFns.length - 1; i >= 0; i--)try {
                            (linkFn = postLinkFns[i])(linkFn.isolateScope ? isolateScope : scope1, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                        } catch (e2) {
                            $exceptionHandler(e2, startingTag($element));
                        }
                    }
                }
                function markDirectivesAsIsolate(directives) {
                    for(var j = 0, jj = directives.length; j < jj; j++)directives[j] = inherit(directives[j], {
                        $$isolateScope: !0
                    });
                }
                function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
                    if (name === ignoreDirective) return null;
                    var match = null;
                    if (hasDirectives.hasOwnProperty(name)) for(var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++)try {
                        directive = directives[i], (maxPriority === undefined || maxPriority > directive.priority) && -1 != directive.restrict.indexOf(location) && (startAttrName && (directive = inherit(directive, {
                            $$start: startAttrName,
                            $$end: endAttrName
                        })), tDirectives.push(directive), match = directive);
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                    return match;
                }
                function mergeTemplateAttributes(dst, src) {
                    var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
                    forEach(dst, function(value, key) {
                        "$" != key.charAt(0) && (src[key] && (value += ("style" === key ? ";" : " ") + src[key]), dst.$set(key, value, !0, srcAttr[key]));
                    }), forEach(src, function(value, key) {
                        "class" == key ? (safeAddClass($element, value), dst.class = (dst.class ? dst.class + " " : "") + value) : "style" == key ? ($element.attr("style", $element.attr("style") + ";" + value), dst.style = (dst.style ? dst.style + ";" : "") + value) : "$" == key.charAt(0) || dst.hasOwnProperty(key) || (dst[key] = value, dstAttr[key] = srcAttr[key]);
                    });
                }
                function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                    var afterTemplateNodeLinkFn, afterTemplateChildLinkFn, linkQueue = [], beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {
                        templateUrl: null,
                        transclude: null,
                        replace: null,
                        $$originalDirective: origAsyncDirective
                    }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
                    return $compileNode.empty(), $http.get($sce.getTrustedResourceUrl(templateUrl), {
                        cache: $templateCache
                    }).success(function(content) {
                        var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                        if (content = denormalizeTemplate(content), origAsyncDirective.replace) {
                            if (compileNode = ($template = jqLite("<div>" + trim1(content) + "</div>").contents())[0], 1 != $template.length || 1 !== compileNode.nodeType) throw $compileMinErr("tplrt", "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
                            tempTemplateAttrs = {
                                $attr: {}
                            }, replaceWith($rootElement, $compileNode, compileNode);
                            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                            isObject(origAsyncDirective.scope) && markDirectivesAsIsolate(templateDirectives), directives = templateDirectives.concat(directives), mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                        } else compileNode = beforeTemplateCompileNode, $compileNode.html(content);
                        for(directives.unshift(derivedSyncDirective), afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext), forEach($rootElement, function(node, i) {
                            node == compileNode && ($rootElement[i] = $compileNode[0]);
                        }), afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn); linkQueue.length;){
                            var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
                            beforeTemplateLinkNode !== beforeTemplateCompileNode && (linkNode = jqLiteClone(compileNode), replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode)), childBoundTranscludeFn = afterTemplateNodeLinkFn.transclude ? createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude) : boundTranscludeFn, afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
                        }
                        linkQueue = null;
                    }).error(function(response, code, headers, config) {
                        throw $compileMinErr("tpload", "Failed to load template: {0}", config.url);
                    }), function(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                        linkQueue ? (linkQueue.push(scope), linkQueue.push(node), linkQueue.push(rootElement), linkQueue.push(boundTranscludeFn)) : afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
                    };
                }
                function byPriority(a, b) {
                    var diff = b.priority - a.priority;
                    return 0 !== diff ? diff : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
                }
                function assertNoDuplicate(what, previousDirective, directive, element) {
                    if (previousDirective) throw $compileMinErr("multidir", "Multiple directives [{0}, {1}] asking for {2} on: {3}", previousDirective.name, directive.name, what, startingTag(element));
                }
                function addTextInterpolateDirective(directives, text) {
                    var interpolateFn = $interpolate(text, !0);
                    interpolateFn && directives.push({
                        priority: 0,
                        compile: valueFn1(function(scope, node) {
                            var parent = node.parent(), bindings = parent.data("$binding") || [];
                            bindings.push(interpolateFn), safeAddClass(parent.data("$binding", bindings), "ng-binding"), scope.$watch(interpolateFn, function(value) {
                                node[0].nodeValue = value;
                            });
                        })
                    });
                }
                function addAttrInterpolateDirective(node1, directives, value, name) {
                    var interpolateFn = $interpolate(value, !0);
                    if (interpolateFn) {
                        if ("multiple" === name && "SELECT" === nodeName_(node1)) throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node1));
                        directives.push({
                            priority: 100,
                            compile: function() {
                                return {
                                    pre: function(scope, element, attr) {
                                        var $$observers = attr.$$observers || (attr.$$observers = {});
                                        if (EVENT_HANDLER_ATTR_REGEXP.test(name)) throw $compileMinErr("nodomevents", "Interpolations for HTML DOM event attributes are disallowed.  Please use the ng- versions (such as ng-click instead of onclick) instead.");
                                        (interpolateFn = $interpolate(attr[name], !0, function(node, attrNormalizedName) {
                                            if ("srcdoc" == attrNormalizedName) return $sce.HTML;
                                            var tag = nodeName_(node);
                                            if ("xlinkHref" == attrNormalizedName || "FORM" == tag && "action" == attrNormalizedName || "IMG" != tag && ("src" == attrNormalizedName || "ngSrc" == attrNormalizedName)) return $sce.RESOURCE_URL;
                                        }(node1, name))) && (attr[name] = interpolateFn(scope), ($$observers[name] || ($$observers[name] = [])).$$inter = !0, (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function(newValue, oldValue) {
                                            "class" === name && newValue != oldValue ? attr.$updateClass(newValue, oldValue) : attr.$set(name, newValue);
                                        }));
                                    }
                                };
                            }
                        });
                    }
                }
                function replaceWith($rootElement, elementsToRemove, newNode) {
                    var i, ii, firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode;
                    if ($rootElement) {
                        for(i = 0, ii = $rootElement.length; i < ii; i++)if ($rootElement[i] == firstElementToRemove) {
                            $rootElement[i++] = newNode;
                            for(var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++)j2 < jj ? $rootElement[j] = $rootElement[j2] : delete $rootElement[j];
                            $rootElement.length -= removeCount - 1;
                            break;
                        }
                    }
                    parent && parent.replaceChild(newNode, firstElementToRemove);
                    var fragment = document1.createDocumentFragment();
                    fragment.appendChild(firstElementToRemove), newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
                    for(var k = 1, kk = elementsToRemove.length; k < kk; k++){
                        var element = elementsToRemove[k];
                        jqLite(element).remove(), fragment.appendChild(element), delete elementsToRemove[k];
                    }
                    elementsToRemove[0] = newNode, elementsToRemove.length = 1;
                }
                function cloneAndAnnotateFn(fn, annotation) {
                    return extend(function() {
                        return fn.apply(null, arguments);
                    }, fn, annotation);
                }
            }, 
        ];
    }
    $CompileProvider.$inject = [
        "$provide",
        "$$sanitizeUriProvider"
    ];
    var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ""));
    }
    function tokenDifference(str1, str2) {
        var values = "", tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
        outer: for(var i = 0; i < tokens1.length; i++){
            for(var token = tokens1[i], j = 0; j < tokens2.length; j++)if (token == tokens2[j]) continue outer;
            values += (values.length > 0 ? " " : "") + token;
        }
        return values;
    }
    function $ControllerProvider() {
        var controllers = {}, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function(name, constructor) {
            assertNotHasOwnProperty(name, "controller"), isObject(name) ? extend(controllers, name) : controllers[name] = constructor;
        }, this.$get = [
            "$injector",
            "$window",
            function($injector, $window) {
                return function(expression, locals) {
                    var instance, match, constructor, identifier;
                    if (isString(expression) && (constructor = (match = expression.match(CNTRL_REG))[1], identifier = match[3], expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter1(locals.$scope, constructor, !0) || getter1($window, constructor, !0), assertArgFn(expression, constructor, !0)), instance = $injector.instantiate(expression, locals), identifier) {
                        if (!(locals && "object" == typeof locals.$scope)) throw minErr("$controller")("noscp", "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", constructor || expression.name, identifier);
                        locals.$scope[identifier] = instance;
                    }
                    return instance;
                };
            }, 
        ];
    }
    function $DocumentProvider() {
        this.$get = [
            "$window",
            function(window) {
                return jqLite(window.document);
            }, 
        ];
    }
    function $ExceptionHandlerProvider() {
        this.$get = [
            "$log",
            function($log) {
                return function(exception, cause) {
                    $log.error.apply($log, arguments);
                };
            }, 
        ];
    }
    function parseHeaders(headers) {
        var key, val, i, parsed = {};
        return headers && forEach(headers.split("\n"), function(line) {
            i = line.indexOf(":"), key = lowercase(trim1(line.substr(0, i))), val = trim1(line.substr(i + 1)), key && (parsed[key] ? parsed[key] += ", " + val : parsed[key] = val);
        }), parsed;
    }
    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;
        return function(name) {
            return (headersObj || (headersObj = parseHeaders(headers)), name) ? headersObj[lowercase(name)] || null : headersObj;
        };
    }
    function transformData(data, headers, fns) {
        return isFunction(fns) ? fns(data, headers) : (forEach(fns, function(fn) {
            data = fn(data, headers);
        }), data);
    }
    function isSuccess(status) {
        return 200 <= status && status < 300;
    }
    function $HttpProvider() {
        var JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, PROTECTION_PREFIX = /^\)\]\}',?\n/, CONTENT_TYPE_APPLICATION_JSON = {
            "Content-Type": "application/json;charset=utf-8"
        }, defaults = this.defaults = {
            transformResponse: [
                function(data) {
                    return isString(data) && (data = data.replace(PROTECTION_PREFIX, ""), JSON_START.test(data) && JSON_END.test(data) && (data = fromJson(data))), data;
                }, 
            ],
            transformRequest: [
                function(d) {
                    var obj;
                    return isObject(d) && (obj = d, "[object File]" !== toString.call(obj)) ? toJson(d) : d;
                }, 
            ],
            headers: {
                common: {
                    Accept: "application/json, text/plain, */*"
                },
                post: CONTENT_TYPE_APPLICATION_JSON,
                put: CONTENT_TYPE_APPLICATION_JSON,
                patch: CONTENT_TYPE_APPLICATION_JSON
            },
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN"
        }, interceptorFactories = this.interceptors = [], responseInterceptorFactories = this.responseInterceptors = [];
        this.$get = [
            "$httpBackend",
            "$browser",
            "$cacheFactory",
            "$rootScope",
            "$q",
            "$injector",
            function($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
                var defaultCache = $cacheFactory("$http"), reversedInterceptors = [];
                function $http(requestConfig) {
                    var config1 = {
                        transformRequest: defaults.transformRequest,
                        transformResponse: defaults.transformResponse
                    }, headers1 = function(config) {
                        var defHeaderName, lowercaseDefHeaderName, reqHeaderName, defHeaders = defaults.headers, reqHeaders = extend({}, config.headers);
                        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]), execHeaders(defHeaders), execHeaders(reqHeaders);
                        defaultHeadersIteration: for(defHeaderName in defHeaders){
                            for(reqHeaderName in lowercaseDefHeaderName = lowercase(defHeaderName), reqHeaders)if (lowercase(reqHeaderName) === lowercaseDefHeaderName) continue defaultHeadersIteration;
                            reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                        }
                        return reqHeaders;
                        function execHeaders(headers) {
                            var headerContent;
                            forEach(headers, function(headerFn, header) {
                                isFunction(headerFn) && (null != (headerContent = headerFn()) ? headers[header] = headerContent : delete headers[header]);
                            });
                        }
                    }(requestConfig);
                    extend(config1, requestConfig), config1.headers = headers1, config1.method = uppercase(config1.method);
                    var xsrfValue = urlIsSameOrigin(config1.url) ? $browser.cookies()[config1.xsrfCookieName || defaults.xsrfCookieName] : undefined;
                    xsrfValue && (headers1[config1.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue);
                    var chain = [
                        function(config) {
                            headers1 = config.headers;
                            var reqData = transformData(config.data, headersGetter(headers1), config.transformRequest);
                            return isUndefined(config.data) && forEach(headers1, function(value, header) {
                                "content-type" === lowercase(header) && delete headers1[header];
                            }), isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials) && (config.withCredentials = defaults.withCredentials), sendReq(config, reqData, headers1).then(transformResponse, transformResponse);
                        },
                        undefined
                    ], promise = $q.when(config1);
                    for(forEach(reversedInterceptors, function(interceptor) {
                        (interceptor.request || interceptor.requestError) && chain.unshift(interceptor.request, interceptor.requestError), (interceptor.response || interceptor.responseError) && chain.push(interceptor.response, interceptor.responseError);
                    }); chain.length;){
                        var thenFn = chain.shift(), rejectFn = chain.shift();
                        promise = promise.then(thenFn, rejectFn);
                    }
                    return promise.success = function(fn) {
                        return promise.then(function(response) {
                            fn(response.data, response.status, response.headers, config1);
                        }), promise;
                    }, promise.error = function(fn) {
                        return promise.then(null, function(response) {
                            fn(response.data, response.status, response.headers, config1);
                        }), promise;
                    }, promise;
                    function transformResponse(response) {
                        var resp = extend({}, response, {
                            data: transformData(response.data, response.headers, config1.transformResponse)
                        });
                        return isSuccess(response.status) ? resp : $q.reject(resp);
                    }
                }
                return forEach(interceptorFactories, function(interceptorFactory) {
                    reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
                }), forEach(responseInterceptorFactories, function(interceptorFactory, index) {
                    var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
                    reversedInterceptors.splice(index, 0, {
                        response: function(response) {
                            return responseFn($q.when(response));
                        },
                        responseError: function(response) {
                            return responseFn($q.reject(response));
                        }
                    });
                }), $http.pendingRequests = [], function(names) {
                    forEach(arguments, function(name) {
                        $http[name] = function(url, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url
                            }));
                        };
                    });
                }("get", "delete", "head", "jsonp"), function(name1) {
                    forEach(arguments, function(name) {
                        $http[name] = function(url, data, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url,
                                data: data
                            }));
                        };
                    });
                }("post", "put"), $http.defaults = defaults, $http;
                function sendReq(config, reqData, reqHeaders) {
                    var cache, cachedResp, deferred = $q.defer(), promise = deferred.promise, url = buildUrl(config.url, config.params);
                    if ($http.pendingRequests.push(config), promise.then(removePendingReq, removePendingReq), (config.cache || defaults.cache) && !1 !== config.cache && "GET" == config.method && (cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache), cache) if (cachedResp = cache.get(url), isDefined(cachedResp)) {
                        if (cachedResp.then) return cachedResp.then(removePendingReq, removePendingReq), cachedResp;
                        isArray(cachedResp) ? resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2])) : resolvePromise(cachedResp, 200, {});
                    } else cache.put(url, promise);
                    return isUndefined(cachedResp) && $httpBackend(config.method, url, reqData, function(status, response, headersString) {
                        cache && (isSuccess(status) ? cache.put(url, [
                            status,
                            response,
                            parseHeaders(headersString)
                        ]) : cache.remove(url)), resolvePromise(response, status, headersString), $rootScope.$$phase || $rootScope.$apply();
                    }, reqHeaders, config.timeout, config.withCredentials, config.responseType), promise;
                    function resolvePromise(response, status, headers) {
                        (isSuccess(status = Math.max(status, 0)) ? deferred.resolve : deferred.reject)({
                            data: response,
                            status: status,
                            headers: headersGetter(headers),
                            config: config
                        });
                    }
                    function removePendingReq() {
                        var idx = indexOf($http.pendingRequests, config);
                        -1 !== idx && $http.pendingRequests.splice(idx, 1);
                    }
                }
                function buildUrl(url, params) {
                    if (!params) return url;
                    var parts = [];
                    return function(obj, iterator, context) {
                        for(var keys = sortedKeys(obj), i = 0; i < keys.length; i++)iterator.call(void 0, obj[keys[i]], keys[i]);
                    }(params, function(value, key) {
                        null === value || isUndefined(value) || (isArray(value) || (value = [
                            value
                        ]), forEach(value, function(v) {
                            isObject(v) && (v = toJson(v)), parts.push(encodeUriQuery(key) + "=" + encodeUriQuery(v));
                        }));
                    }), url + (-1 == url.indexOf("?") ? "?" : "&") + parts.join("&");
                }
            }, 
        ];
    }
    var XHR1 = window1.XMLHttpRequest || function() {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e1) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e2) {}
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e3) {}
        throw minErr("$httpBackend")("noxhr", "This browser does not support XMLHttpRequest.");
    };
    function $HttpBackendProvider() {
        this.$get = [
            "$browser",
            "$window",
            "$document",
            function($browser, $window, $document) {
                return createHttpBackend($browser, XHR1, $browser.defer, $window.angular.callbacks, $document[0]);
            }, 
        ];
    }
    function createHttpBackend($browser, XHR, $browserDefer, callbacks, rawDocument) {
        return function(method, url, post, callback1, headers, timeout, withCredentials, responseType) {
            var status1;
            if ($browser.$$incOutstandingRequestCount(), url = url || $browser.url(), "jsonp" == lowercase(method)) {
                var callbackId = "_" + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function(data) {
                    callbacks[callbackId].data = data;
                };
                var jsonpDone = jsonpReq(url.replace("JSON_CALLBACK", "angular.callbacks." + callbackId), function() {
                    callbacks[callbackId].data ? completeRequest(callback1, 200, callbacks[callbackId].data) : completeRequest(callback1, status1 || -2), delete callbacks[callbackId];
                });
            } else {
                var xhr = new XHR();
                xhr.open(method, url, !0), forEach(headers, function(value, key) {
                    isDefined(value) && xhr.setRequestHeader(key, value);
                }), xhr.onreadystatechange = function() {
                    if (4 == xhr.readyState) {
                        var responseHeaders = null, response = null;
                        -1 !== status1 && (responseHeaders = xhr.getAllResponseHeaders(), response = xhr.responseType ? xhr.response : xhr.responseText), completeRequest(callback1, status1 || xhr.status, response, responseHeaders);
                    }
                }, withCredentials && (xhr.withCredentials = !0), responseType && (xhr.responseType = responseType), xhr.send(post || null);
            }
            if (timeout > 0) var timeoutId = $browserDefer(timeoutRequest, timeout);
            else timeout && timeout.then && timeout.then(timeoutRequest);
            function timeoutRequest() {
                status1 = -1, jsonpDone && jsonpDone(), xhr && xhr.abort();
            }
            function completeRequest(callback, status, response, headersString) {
                var protocol = urlResolve(url).protocol;
                timeoutId && $browserDefer.cancel(timeoutId), jsonpDone = xhr = null, callback(status = 1223 == (status = "file" == protocol && 0 === status ? response ? 200 : 404 : status) ? 204 : status, response, headersString), $browser.$$completeOutstandingRequest(noop);
            }
        };
        function jsonpReq(url, done) {
            var script = rawDocument.createElement("script"), doneWrapper = function() {
                script.onreadystatechange = script.onload = script.onerror = null, rawDocument.body.removeChild(script), done && done();
            };
            return script.type = "text/javascript", script.src = url, msie && msie <= 8 ? script.onreadystatechange = function() {
                /loaded|complete/.test(script.readyState) && doneWrapper();
            } : script.onload = script.onerror = function() {
                doneWrapper();
            }, rawDocument.body.appendChild(script), doneWrapper;
        }
    }
    var $interpolateMinErr = minErr("$interpolate");
    function $InterpolateProvider() {
        var startSymbol = "{{", endSymbol = "}}";
        this.startSymbol = function(value) {
            return value ? (startSymbol = value, this) : startSymbol;
        }, this.endSymbol = function(value) {
            return value ? (endSymbol = value, this) : endSymbol;
        }, this.$get = [
            "$parse",
            "$exceptionHandler",
            "$sce",
            function($parse, $exceptionHandler, $sce) {
                var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
                function $interpolate(text, mustHaveExpression, trustedContext) {
                    for(var startIndex, endIndex, fn, exp, index = 0, parts = [], length = text.length, hasInterpolation = !1, concat = []; index < length;)-1 != (startIndex = text.indexOf(startSymbol, index)) && -1 != (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) ? (index != startIndex && parts.push(text.substring(index, startIndex)), parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex))), fn.exp = exp, index = endIndex + endSymbolLength, hasInterpolation = !0) : (index != length && parts.push(text.substring(index)), index = length);
                    if ((length = parts.length) || (parts.push(""), length = 1), trustedContext && parts.length > 1) throw $interpolateMinErr("noconcat", "Error while interpolating: {0}\nStrict Contextual Escaping disallows interpolations that concatenate multiple expressions when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce", text);
                    if (!mustHaveExpression || hasInterpolation) return concat.length = length, (fn = function(context) {
                        try {
                            for(var part, i = 0, ii = length; i < ii; i++)"function" == typeof (part = parts[i]) && (part = part(context), part = trustedContext ? $sce.getTrusted(trustedContext, part) : $sce.valueOf(part), null === part || isUndefined(part) ? part = "" : "string" != typeof part && (part = toJson(part))), concat[i] = part;
                            return concat.join("");
                        } catch (err) {
                            var newErr = $interpolateMinErr("interr", "Can't interpolate: {0}\n{1}", text, err.toString());
                            $exceptionHandler(newErr);
                        }
                    }).exp = text, fn.parts = parts, fn;
                }
                return $interpolate.startSymbol = function() {
                    return startSymbol;
                }, $interpolate.endSymbol = function() {
                    return endSymbol;
                }, $interpolate;
            }, 
        ];
    }
    function $IntervalProvider() {
        this.$get = [
            "$rootScope",
            "$window",
            "$q",
            function($rootScope, $window, $q) {
                var intervals = {};
                function interval(fn, delay, count, invokeApply) {
                    var setInterval = $window.setInterval, clearInterval = $window.clearInterval, deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply;
                    return count = isDefined(count) ? count : 0, promise.then(null, null, fn), promise.$$intervalId = setInterval(function() {
                        deferred.notify(iteration++), count > 0 && iteration >= count && (deferred.resolve(iteration), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId]), skipApply || $rootScope.$apply();
                    }, delay), intervals[promise.$$intervalId] = deferred, promise;
                }
                return interval.cancel = function(promise) {
                    return !!promise && promise.$$intervalId in intervals && (intervals[promise.$$intervalId].reject("canceled"), clearInterval(promise.$$intervalId), delete intervals[promise.$$intervalId], !0);
                }, interval;
            }, 
        ];
    }
    function $LocaleProvider() {
        this.$get = function() {
            return {
                id: "en-us",
                NUMBER_FORMATS: {
                    DECIMAL_SEP: ".",
                    GROUP_SEP: ",",
                    PATTERNS: [
                        {
                            minInt: 1,
                            minFrac: 0,
                            maxFrac: 3,
                            posPre: "",
                            posSuf: "",
                            negPre: "-",
                            negSuf: "",
                            gSize: 3,
                            lgSize: 3
                        },
                        {
                            minInt: 1,
                            minFrac: 2,
                            maxFrac: 2,
                            posPre: "\u00A4",
                            posSuf: "",
                            negPre: "(\u00A4",
                            negSuf: ")",
                            gSize: 3,
                            lgSize: 3
                        }, 
                    ],
                    CURRENCY_SYM: "$"
                },
                DATETIME_FORMATS: {
                    MONTH: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    SHORTMONTH: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    DAY: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    SHORTDAY: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    AMPMS: [
                        "AM",
                        "PM"
                    ],
                    medium: "MMM d, y h:mm:ss a",
                    short: "M/d/yy h:mm a",
                    fullDate: "EEEE, MMMM d, y",
                    longDate: "MMMM d, y",
                    mediumDate: "MMM d, y",
                    shortDate: "M/d/yy",
                    mediumTime: "h:mm:ss a",
                    shortTime: "h:mm a"
                },
                pluralCat: function(num) {
                    return 1 === num ? "one" : "other";
                }
            };
        };
    }
    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
        http: 80,
        https: 443,
        ftp: 21
    }, $locationMinErr = minErr("$location");
    function encodePath(path) {
        for(var segments = path.split("/"), i = segments.length; i--;)segments[i] = encodeUriSegment(segments[i]);
        return segments.join("/");
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
        var parsedUrl = urlResolve(absoluteUrl, appBase);
        locationObj.$$protocol = parsedUrl.protocol, locationObj.$$host = parsedUrl.hostname, locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj, appBase) {
        var prefixed = "/" !== relativeUrl.charAt(0);
        prefixed && (relativeUrl = "/" + relativeUrl);
        var match = urlResolve(relativeUrl, appBase);
        locationObj.$$path = decodeURIComponent(prefixed && "/" === match.pathname.charAt(0) ? match.pathname.substring(1) : match.pathname), locationObj.$$search = parseKeyValue(match.search), locationObj.$$hash = decodeURIComponent(match.hash), locationObj.$$path && "/" != locationObj.$$path.charAt(0) && (locationObj.$$path = "/" + locationObj.$$path);
    }
    function beginsWith(begin, whole) {
        if (0 === whole.indexOf(begin)) return whole.substr(begin.length);
    }
    function stripHash(url) {
        var index = url.indexOf("#");
        return -1 == index ? url : url.substr(0, index);
    }
    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf("/") + 1);
    }
    function LocationHtml5Url(appBase, basePrefix) {
        this.$$html5 = !0, basePrefix = basePrefix || "";
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase), this.$$parse = function(url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl)) throw $locationMinErr("ipthprfx", 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
            parseAppUrl(pathUrl, this, appBase), this.$$path || (this.$$path = "/"), this.$$compose();
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
        }, this.$$rewrite = function(url) {
            var appUrl, prevAppUrl;
            return undefined !== (appUrl = beginsWith(appBase, url)) ? (prevAppUrl = appUrl, undefined !== (appUrl = beginsWith(basePrefix, appUrl))) ? appBaseNoFile + (beginsWith("/", appUrl) || appUrl) : appBase + prevAppUrl : undefined !== (appUrl = beginsWith(appBaseNoFile, url)) ? appBaseNoFile + appUrl : appBaseNoFile == url + "/" ? appBaseNoFile : void 0;
        };
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
        var appBaseNoFile = stripFile(appBase);
        parseAbsoluteUrl(appBase, this, appBase), this.$$parse = function(url) {
            var path, url1, base, firstPathSegmentMatch, windowsFilePathExp, withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url), withoutHashUrl = "#" == withoutBaseUrl.charAt(0) ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : "";
            if (!isString(withoutHashUrl)) throw $locationMinErr("ihshprfx", 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
            parseAppUrl(withoutHashUrl, this, appBase), this.$$path = (path = this.$$path, url1 = withoutHashUrl, base = appBase, windowsFilePathExp = /^\/?.*?:(\/.*)/, (0 === url1.indexOf(base) && (url1 = url1.replace(base, "")), windowsFilePathExp.exec(url1)) ? path : (firstPathSegmentMatch = windowsFilePathExp.exec(path)) ? firstPathSegmentMatch[1] : path), this.$$compose();
        }, this.$$compose = function() {
            var search = toKeyValue(this.$$search), hash = this.$$hash ? "#" + encodeUriSegment(this.$$hash) : "";
            this.$$url = encodePath(this.$$path) + (search ? "?" + search : "") + hash, this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : "");
        }, this.$$rewrite = function(url) {
            if (stripHash(appBase) == stripHash(url)) return url;
        };
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
        this.$$html5 = !0, LocationHashbangUrl.apply(this, arguments);
        var appBaseNoFile = stripFile(appBase);
        this.$$rewrite = function(url) {
            var appUrl;
            return appBase == stripHash(url) ? url : (appUrl = beginsWith(appBaseNoFile, url)) ? appBase + hashPrefix + appUrl : appBaseNoFile === url + "/" ? appBaseNoFile : void 0;
        };
    }
    function locationGetter(property) {
        return function() {
            return this[property];
        };
    }
    function locationGetterSetter(property, preprocess) {
        return function(value) {
            return isUndefined(value) ? this[property] : (this[property] = preprocess(value), this.$$compose(), this);
        };
    }
    function $LocationProvider() {
        var hashPrefix = "", html5Mode = !1;
        this.hashPrefix = function(prefix) {
            return isDefined(prefix) ? (hashPrefix = prefix, this) : hashPrefix;
        }, this.html5Mode = function(mode) {
            return isDefined(mode) ? (html5Mode = mode, this) : html5Mode;
        }, this.$get = [
            "$rootScope",
            "$browser",
            "$sniffer",
            "$rootElement",
            function($rootScope, $browser, $sniffer, $rootElement) {
                var url, $location, LocationMode, appBase, baseHref = $browser.baseHref(), initialUrl = $browser.url();
                html5Mode ? (appBase = (url = initialUrl).substring(0, url.indexOf("/", url.indexOf("//") + 2)) + (baseHref || "/"), LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url) : (appBase = stripHash(initialUrl), LocationMode = LocationHashbangUrl), ($location = new LocationMode(appBase, "#" + hashPrefix)).$$parse($location.$$rewrite(initialUrl)), $rootElement.on("click", function(event) {
                    if (!event.ctrlKey && !event.metaKey && 2 != event.which) {
                        for(var elm = jqLite(event.target); "a" !== lowercase(elm[0].nodeName);)if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                        var absHref = elm.prop("href"), rewrittenUrl = $location.$$rewrite(absHref);
                        absHref && !elm.attr("target") && rewrittenUrl && !event.isDefaultPrevented() && (event.preventDefault(), rewrittenUrl != $browser.url() && ($location.$$parse(rewrittenUrl), $rootScope.$apply(), window1.angular["ff-684208-preventDefault"] = !0));
                    }
                }), $location.absUrl() != initialUrl && $browser.url($location.absUrl(), !0), $browser.onUrlChange(function(newUrl) {
                    if ($location.absUrl() != newUrl) {
                        if ($rootScope.$broadcast("$locationChangeStart", newUrl, $location.absUrl()).defaultPrevented) {
                            $browser.url($location.absUrl());
                            return;
                        }
                        $rootScope.$evalAsync(function() {
                            var oldUrl = $location.absUrl();
                            $location.$$parse(newUrl), afterLocationChange(oldUrl);
                        }), $rootScope.$$phase || $rootScope.$digest();
                    }
                });
                var changeCounter = 0;
                return $rootScope.$watch(function() {
                    var oldUrl = $browser.url(), currentReplace = $location.$$replace;
                    return changeCounter && oldUrl == $location.absUrl() || (changeCounter++, $rootScope.$evalAsync(function() {
                        $rootScope.$broadcast("$locationChangeStart", $location.absUrl(), oldUrl).defaultPrevented ? $location.$$parse(oldUrl) : ($browser.url($location.absUrl(), currentReplace), afterLocationChange(oldUrl));
                    })), $location.$$replace = !1, changeCounter;
                }), $location;
                function afterLocationChange(oldUrl) {
                    $rootScope.$broadcast("$locationChangeSuccess", $location.absUrl(), oldUrl);
                }
            }, 
        ];
    }
    function $LogProvider() {
        var debug = !0, self = this;
        this.debugEnabled = function(flag) {
            return isDefined(flag) ? (debug = flag, this) : debug;
        }, this.$get = [
            "$window",
            function($window) {
                var fn;
                return {
                    log: consoleLog("log"),
                    info: consoleLog("info"),
                    warn: consoleLog("warn"),
                    error: consoleLog("error"),
                    debug: (fn = consoleLog("debug"), function() {
                        debug && fn.apply(self, arguments);
                    })
                };
                function consoleLog(type) {
                    var console = $window.console || {}, logFn = console[type] || console.log || noop;
                    return logFn.apply ? function() {
                        var args = [];
                        return forEach(arguments, function(arg) {
                            var arg4;
                            args.push(((arg4 = arg) instanceof Error && (arg4.stack ? arg4 = arg4.message && -1 === arg4.stack.indexOf(arg4.message) ? "Error: " + arg4.message + "\n" + arg4.stack : arg4.stack : arg4.sourceURL && (arg4 = arg4.message + "\n" + arg4.sourceURL + ":" + arg4.line)), arg4));
                        }), logFn.apply(console, args);
                    } : function(arg1, arg2) {
                        logFn(arg1, null == arg2 ? "" : arg2);
                    };
                }
            }, 
        ];
    }
    LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
        $$html5: !1,
        $$replace: !1,
        absUrl: locationGetter("$$absUrl"),
        url: function(url, replace) {
            if (isUndefined(url)) return this.$$url;
            var match = PATH_MATCH.exec(url);
            return match[1] && this.path(decodeURIComponent(match[1])), (match[2] || match[1]) && this.search(match[3] || ""), this.hash(match[5] || "", replace), this;
        },
        protocol: locationGetter("$$protocol"),
        host: locationGetter("$$host"),
        port: locationGetter("$$port"),
        path: locationGetterSetter("$$path", function(path) {
            return "/" == path.charAt(0) ? path : "/" + path;
        }),
        search: function(search, paramValue) {
            switch(arguments.length){
                case 0:
                    return this.$$search;
                case 1:
                    if (isString(search)) this.$$search = parseKeyValue(search);
                    else if (isObject(search)) this.$$search = search;
                    else throw $locationMinErr("isrcharg", "The first argument of the `$location#search()` call must be a string or an object.");
                    break;
                default:
                    isUndefined(paramValue) || null === paramValue ? delete this.$$search[search] : this.$$search[search] = paramValue;
            }
            return this.$$compose(), this;
        },
        hash: locationGetterSetter("$$hash", identity),
        replace: function() {
            return this.$$replace = !0, this;
        }
    };
    var $parseMinErr = minErr("$parse"), promiseWarningCache = {};
    function ensureSafeMemberName(name, fullExpression) {
        if ("constructor" === name) throw $parseMinErr("isecfld", 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
        return name;
    }
    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) throw $parseMinErr("isecfn", "Referencing Function in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.document && obj.location && obj.alert && obj.setInterval) throw $parseMinErr("isecwindow", "Referencing the Window in Angular expressions is disallowed! Expression: {0}", fullExpression);
            if (obj.children && (obj.nodeName || obj.on && obj.find)) throw $parseMinErr("isecdom", "Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}", fullExpression);
        }
        return obj;
    }
    var OPERATORS = {
        null: function() {
            return null;
        },
        true: function() {
            return !0;
        },
        false: function() {
            return !1;
        },
        undefined: noop,
        "+": function(self, locals, a, b) {
            return (a = a(self, locals), b = b(self, locals), isDefined(a)) ? isDefined(b) ? a + b : a : isDefined(b) ? b : undefined;
        },
        "-": function(self, locals, a, b) {
            return a = a(self, locals), b = b(self, locals), (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
        "*": function(self, locals, a, b) {
            return a(self, locals) * b(self, locals);
        },
        "/": function(self, locals, a, b) {
            return a(self, locals) / b(self, locals);
        },
        "%": function(self, locals, a, b) {
            return a(self, locals) % b(self, locals);
        },
        "^": function(self, locals, a, b) {
            return a(self, locals) ^ b(self, locals);
        },
        "=": noop,
        "===": function(self, locals, a, b) {
            return a(self, locals) === b(self, locals);
        },
        "!==": function(self, locals, a, b) {
            return a(self, locals) !== b(self, locals);
        },
        "==": function(self, locals, a, b) {
            return a(self, locals) == b(self, locals);
        },
        "!=": function(self, locals, a, b) {
            return a(self, locals) != b(self, locals);
        },
        "<": function(self, locals, a, b) {
            return a(self, locals) < b(self, locals);
        },
        ">": function(self, locals, a, b) {
            return a(self, locals) > b(self, locals);
        },
        "<=": function(self, locals, a, b) {
            return a(self, locals) <= b(self, locals);
        },
        ">=": function(self, locals, a, b) {
            return a(self, locals) >= b(self, locals);
        },
        "&&": function(self, locals, a, b) {
            return a(self, locals) && b(self, locals);
        },
        "||": function(self, locals, a, b) {
            return a(self, locals) || b(self, locals);
        },
        "&": function(self, locals, a, b) {
            return a(self, locals) & b(self, locals);
        },
        "|": function(self, locals, a, b) {
            return b(self, locals)(self, locals, a(self, locals));
        },
        "!": function(self, locals, a) {
            return !a(self, locals);
        }
    }, ESCAPE = {
        n: "\n",
        f: "\f",
        r: "\r",
        t: "\t",
        v: "\v",
        "'": "'",
        '"': '"'
    }, Lexer = function(options) {
        this.options = options;
    };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function(text) {
            this.text = text, this.index = 0, this.ch = undefined, this.lastCh = ":", this.tokens = [];
            for(var token, json = []; this.index < this.text.length;){
                if (this.ch = this.text.charAt(this.index), this.is("\"'")) this.readString(this.ch);
                else if (this.isNumber(this.ch) || this.is(".") && this.isNumber(this.peek())) this.readNumber();
                else if (this.isIdent(this.ch)) this.readIdent(), this.was("{,") && "{" === json[0] && (token = this.tokens[this.tokens.length - 1]) && (token.json = -1 === token.text.indexOf("."));
                else if (this.is("(){}[].,;:?")) this.tokens.push({
                    index: this.index,
                    text: this.ch,
                    json: this.was(":[,") && this.is("{[") || this.is("}]:,")
                }), this.is("{[") && json.unshift(this.ch), this.is("}]") && json.shift(), this.index++;
                else if (this.isWhitespace(this.ch)) {
                    this.index++;
                    continue;
                } else {
                    var ch2 = this.ch + this.peek(), ch3 = ch2 + this.peek(2), fn = OPERATORS[this.ch], fn2 = OPERATORS[ch2], fn3 = OPERATORS[ch3];
                    fn3 ? (this.tokens.push({
                        index: this.index,
                        text: ch3,
                        fn: fn3
                    }), this.index += 3) : fn2 ? (this.tokens.push({
                        index: this.index,
                        text: ch2,
                        fn: fn2
                    }), this.index += 2) : fn ? (this.tokens.push({
                        index: this.index,
                        text: this.ch,
                        fn: fn,
                        json: this.was("[,:") && this.is("+-")
                    }), this.index += 1) : this.throwError("Unexpected next character ", this.index, this.index + 1);
                }
                this.lastCh = this.ch;
            }
            return this.tokens;
        },
        is: function(chars) {
            return -1 !== chars.indexOf(this.ch);
        },
        was: function(chars) {
            return -1 !== chars.indexOf(this.lastCh);
        },
        peek: function(i) {
            var num = i || 1;
            return this.index + num < this.text.length && this.text.charAt(this.index + num);
        },
        isNumber: function(ch) {
            return "0" <= ch && ch <= "9";
        },
        isWhitespace: function(ch) {
            return " " === ch || "\r" === ch || "\t" === ch || "\n" === ch || "\v" === ch || "\u00A0" === ch;
        },
        isIdent: function(ch) {
            return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || "$" === ch;
        },
        isExpOperator: function(ch) {
            return "-" === ch || "+" === ch || this.isNumber(ch);
        },
        throwError: function(error, start, end) {
            end = end || this.index;
            var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
            throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
        },
        readNumber: function() {
            for(var number = "", start = this.index; this.index < this.text.length;){
                var ch = lowercase(this.text.charAt(this.index));
                if ("." == ch || this.isNumber(ch)) number += ch;
                else {
                    var peekCh = this.peek();
                    if ("e" == ch && this.isExpOperator(peekCh)) number += ch;
                    else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && "e" == number.charAt(number.length - 1)) number += ch;
                    else if (!this.isExpOperator(ch) || peekCh && this.isNumber(peekCh) || "e" != number.charAt(number.length - 1)) break;
                    else this.throwError("Invalid exponent");
                }
                this.index++;
            }
            number *= 1, this.tokens.push({
                index: start,
                text: number,
                json: !0,
                fn: function() {
                    return number;
                }
            });
        },
        readIdent: function() {
            for(var lastDot, peekIndex, methodName, ch, parser = this, ident = "", start = this.index; this.index < this.text.length && ("." === (ch = this.text.charAt(this.index)) || this.isIdent(ch) || this.isNumber(ch));)"." === ch && (lastDot = this.index), ident += ch, this.index++;
            if (lastDot) for(peekIndex = this.index; peekIndex < this.text.length;){
                if ("(" === (ch = this.text.charAt(peekIndex))) {
                    methodName = ident.substr(lastDot - start + 1), ident = ident.substr(0, lastDot - start), this.index = peekIndex;
                    break;
                }
                if (this.isWhitespace(ch)) peekIndex++;
                else break;
            }
            var token = {
                index: start,
                text: ident
            };
            if (OPERATORS.hasOwnProperty(ident)) token.fn = OPERATORS[ident], token.json = OPERATORS[ident];
            else {
                var getter = getterFn(ident, this.options, this.text);
                token.fn = extend(function(self, locals) {
                    return getter(self, locals);
                }, {
                    assign: function(self, value) {
                        return setter(self, ident, value, parser.text, parser.options);
                    }
                });
            }
            this.tokens.push(token), methodName && (this.tokens.push({
                index: lastDot,
                text: ".",
                json: !1
            }), this.tokens.push({
                index: lastDot + 1,
                text: methodName,
                json: !1
            }));
        },
        readString: function(quote) {
            var start = this.index;
            this.index++;
            for(var string = "", rawString = quote, escape = !1; this.index < this.text.length;){
                var ch = this.text.charAt(this.index);
                if (rawString += ch, escape) {
                    if ("u" === ch) {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        hex.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + hex + "]"), this.index += 4, string += String.fromCharCode(parseInt(hex, 16));
                    } else {
                        var rep = ESCAPE[ch];
                        rep ? string += rep : string += ch;
                    }
                    escape = !1;
                } else if ("\\" === ch) escape = !0;
                else if (ch === quote) {
                    this.index++, this.tokens.push({
                        index: start,
                        text: rawString,
                        string: string,
                        json: !0,
                        fn: function() {
                            return string;
                        }
                    });
                    return;
                } else string += ch;
                this.index++;
            }
            this.throwError("Unterminated quote", start);
        }
    };
    var Parser = function(lexer, $filter, options) {
        this.lexer = lexer, this.$filter = $filter, this.options = options;
    };
    function setter(obj, path, setValue, fullExp, options) {
        options = options || {};
        for(var key, element = path.split("."), i = 0; element.length > 1; i++){
            var propertyObj = obj[key = ensureSafeMemberName(element.shift(), fullExp)];
            propertyObj || (propertyObj = {}, obj[key] = propertyObj), (obj = propertyObj).then && options.unwrapPromises && (promiseWarning(fullExp), "$$v" in obj || function(promise) {
                promise.then(function(val) {
                    promise.$$v = val;
                });
            }(obj), undefined === obj.$$v && (obj.$$v = {}), obj = obj.$$v);
        }
        return obj[key = ensureSafeMemberName(element.shift(), fullExp)] = setValue, setValue;
    }
    Parser.ZERO = function() {
        return 0;
    }, Parser.prototype = {
        constructor: Parser,
        parse: function(text, json) {
            this.text = text, this.json = json, this.tokens = this.lexer.lex(text), json && (this.assignment = this.logicalOR, this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function() {
                this.throwError("is not valid json", {
                    text: text,
                    index: 0
                });
            });
            var value = json ? this.primary() : this.statements();
            return 0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]), value.literal = !!value.literal, value.constant = !!value.constant, value;
        },
        primary: function() {
            if (this.expect("(")) primary = this.filterChain(), this.consume(")");
            else if (this.expect("[")) primary = this.arrayDeclaration();
            else if (this.expect("{")) primary = this.object();
            else {
                var primary, next, context, token = this.expect();
                (primary = token.fn) || this.throwError("not a primary expression", token), token.json && (primary.constant = !0, primary.literal = !0);
            }
            for(; next = this.expect("(", "[", ".");)"(" === next.text ? (primary = this.functionCall(primary, context), context = null) : "[" === next.text ? (context = primary, primary = this.objectIndex(primary)) : "." === next.text ? (context = primary, primary = this.fieldAccess(primary)) : this.throwError("IMPOSSIBLE");
            return primary;
        },
        throwError: function(msg, token) {
            throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
        },
        peekToken: function() {
            if (0 === this.tokens.length) throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
            return this.tokens[0];
        },
        peek: function(e1, e2, e3, e4) {
            if (this.tokens.length > 0) {
                var token = this.tokens[0], t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) return token;
            }
            return !1;
        },
        expect: function(e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            return !!token && (this.json && !token.json && this.throwError("is not valid json", token), this.tokens.shift(), token);
        },
        consume: function(e1) {
            this.expect(e1) || this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
        },
        unaryFn: function(fn, right) {
            return extend(function(self, locals) {
                return fn(self, locals, right);
            }, {
                constant: right.constant
            });
        },
        ternaryFn: function(left, middle, right) {
            return extend(function(self, locals) {
                return left(self, locals) ? middle(self, locals) : right(self, locals);
            }, {
                constant: left.constant && middle.constant && right.constant
            });
        },
        binaryFn: function(left, fn, right) {
            return extend(function(self, locals) {
                return fn(self, locals, left, right);
            }, {
                constant: left.constant && right.constant
            });
        },
        statements: function() {
            for(var statements = [];;)if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]") && statements.push(this.filterChain()), !this.expect(";")) return 1 === statements.length ? statements[0] : function(self, locals) {
                for(var value, i = 0; i < statements.length; i++){
                    var statement = statements[i];
                    statement && (value = statement(self, locals));
                }
                return value;
            };
        },
        filterChain: function() {
            for(var token, left = this.expression();;){
                if (!(token = this.expect("|"))) return left;
                left = this.binaryFn(left, token.fn, this.filter());
            }
        },
        filter: function() {
            for(var token = this.expect(), fn = this.$filter(token.text), argsFn = [];;)if (token = this.expect(":")) argsFn.push(this.expression());
            else {
                var fnInvoke = function(self, locals, input) {
                    for(var args = [
                        input
                    ], i = 0; i < argsFn.length; i++)args.push(argsFn[i](self, locals));
                    return fn.apply(self, args);
                };
                return function() {
                    return fnInvoke;
                };
            }
        },
        expression: function() {
            return this.assignment();
        },
        assignment: function() {
            var right, token, left = this.ternary();
            return (token = this.expect("=")) ? (left.assign || this.throwError("implies assignment but [" + this.text.substring(0, token.index) + "] can not be assigned to", token), right = this.ternary(), function(scope, locals) {
                return left.assign(scope, right(scope, locals), locals);
            }) : left;
        },
        ternary: function() {
            var middle, token, left = this.logicalOR();
            return (token = this.expect("?")) ? (middle = this.ternary(), token = this.expect(":")) ? this.ternaryFn(left, middle, this.ternary()) : void this.throwError("expected :", token) : left;
        },
        logicalOR: function() {
            for(var token, left = this.logicalAND();;){
                if (!(token = this.expect("||"))) return left;
                left = this.binaryFn(left, token.fn, this.logicalAND());
            }
        },
        logicalAND: function() {
            var token, left = this.equality();
            return (token = this.expect("&&")) && (left = this.binaryFn(left, token.fn, this.logicalAND())), left;
        },
        equality: function() {
            var token, left = this.relational();
            return (token = this.expect("==", "!=", "===", "!==")) && (left = this.binaryFn(left, token.fn, this.equality())), left;
        },
        relational: function() {
            var token, left = this.additive();
            return (token = this.expect("<", ">", "<=", ">=")) && (left = this.binaryFn(left, token.fn, this.relational())), left;
        },
        additive: function() {
            for(var token, left = this.multiplicative(); token = this.expect("+", "-");)left = this.binaryFn(left, token.fn, this.multiplicative());
            return left;
        },
        multiplicative: function() {
            for(var token, left = this.unary(); token = this.expect("*", "/", "%");)left = this.binaryFn(left, token.fn, this.unary());
            return left;
        },
        unary: function() {
            var token;
            return this.expect("+") ? this.primary() : (token = this.expect("-")) ? this.binaryFn(Parser.ZERO, token.fn, this.unary()) : (token = this.expect("!")) ? this.unaryFn(token.fn, this.unary()) : this.primary();
        },
        fieldAccess: function(object) {
            var parser = this, field = this.expect().text, getter = getterFn(field, this.options, this.text);
            return extend(function(scope, locals, self) {
                return getter(self || object(scope, locals), locals);
            }, {
                assign: function(scope, value, locals) {
                    return setter(object(scope, locals), field, value, parser.text, parser.options);
                }
            });
        },
        objectIndex: function(obj) {
            var parser = this, indexFn = this.expression();
            return this.consume("]"), extend(function(self, locals) {
                var v, p, o = obj(self, locals), i = indexFn(self, locals);
                if (o) return (v = ensureSafeObject(o[i], parser.text)) && v.then && parser.options.unwrapPromises && (p = v, "$$v" in v || (p.$$v = undefined, p.then(function(val) {
                    p.$$v = val;
                })), v = v.$$v), v;
            }, {
                assign: function(self, value, locals) {
                    var key = indexFn(self, locals);
                    return ensureSafeObject(obj(self, locals), parser.text)[key] = value;
                }
            });
        },
        functionCall: function(fn, contextGetter) {
            var argsFn = [];
            if (")" !== this.peekToken().text) do argsFn.push(this.expression());
            while (this.expect(","))
            this.consume(")");
            var parser = this;
            return function(scope, locals) {
                for(var args = [], context = contextGetter ? contextGetter(scope, locals) : scope, i = 0; i < argsFn.length; i++)args.push(argsFn[i](scope, locals));
                var fnPtr = fn(scope, locals, context) || noop;
                ensureSafeObject(context, parser.text), ensureSafeObject(fnPtr, parser.text);
                var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
                return ensureSafeObject(v, parser.text);
            };
        },
        arrayDeclaration: function() {
            var elementFns = [], allConstant = !0;
            if ("]" !== this.peekToken().text) do {
                var elementFn = this.expression();
                elementFns.push(elementFn), elementFn.constant || (allConstant = !1);
            }while (this.expect(","))
            return this.consume("]"), extend(function(self, locals) {
                for(var array = [], i = 0; i < elementFns.length; i++)array.push(elementFns[i](self, locals));
                return array;
            }, {
                literal: !0,
                constant: allConstant
            });
        },
        object: function() {
            var keyValues = [], allConstant = !0;
            if ("}" !== this.peekToken().text) do {
                var token = this.expect(), key = token.string || token.text;
                this.consume(":");
                var value = this.expression();
                keyValues.push({
                    key: key,
                    value: value
                }), value.constant || (allConstant = !1);
            }while (this.expect(","))
            return this.consume("}"), extend(function(self, locals) {
                for(var object = {}, i = 0; i < keyValues.length; i++){
                    var keyValue = keyValues[i];
                    object[keyValue.key] = keyValue.value(self, locals);
                }
                return object;
            }, {
                literal: !0,
                constant: allConstant
            });
        }
    };
    var getterFnCache = {};
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
        return ensureSafeMemberName(key0, fullExp), ensureSafeMemberName(key1, fullExp), ensureSafeMemberName(key2, fullExp), ensureSafeMemberName(key3, fullExp), ensureSafeMemberName(key4, fullExp), options.unwrapPromises ? function(scope, locals) {
            var promise, pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null === pathVal || pathVal === undefined || ((pathVal = pathVal[key0]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key1 && null !== pathVal && pathVal !== undefined && ((pathVal = pathVal[key1]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key2 && null !== pathVal && pathVal !== undefined && ((pathVal = pathVal[key2]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key3 && null !== pathVal && pathVal !== undefined && ((pathVal = pathVal[key3]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v), key4 && null !== pathVal && pathVal !== undefined && (pathVal = pathVal[key4]) && pathVal.then && (promiseWarning(fullExp), "$$v" in pathVal || ((promise = pathVal).$$v = undefined, promise.then(function(val) {
                promise.$$v = val;
            })), pathVal = pathVal.$$v))))), pathVal;
        } : function(scope, locals) {
            var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
            return null === pathVal || pathVal === undefined ? pathVal : (pathVal = pathVal[key0], key1 && null !== pathVal && pathVal !== undefined && (pathVal = pathVal[key1], key2 && null !== pathVal && pathVal !== undefined && (pathVal = pathVal[key2], key3 && null !== pathVal && pathVal !== undefined && (pathVal = pathVal[key3], key4 && null !== pathVal && pathVal !== undefined)))) ? pathVal = pathVal[key4] : pathVal;
        };
    }
    function getterFn(path, options, fullExp) {
        if (getterFnCache.hasOwnProperty(path)) return getterFnCache[path];
        var fn, pathKeys = path.split("."), pathKeysLength = pathKeys.length;
        if (options.csp) fn = pathKeysLength < 6 ? cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options) : function(scope, locals) {
            var val, i = 0;
            do val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals), locals = undefined, scope = val;
            while (i < pathKeysLength)
            return val;
        };
        else {
            var code = "var l, fn, p;\n";
            forEach(pathKeys, function(key, index) {
                ensureSafeMemberName(key, fullExp), code += "if(s === null || s === undefined) return s;\nl=s;\ns=" + (index ? "s" : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"];\n' + (options.unwrapPromises ? 'if (s && s.then) {\n pw("' + fullExp.replace(/(["\r\n])/g, "\\$1") + '");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n' : "");
            }), code += "return s;";
            var evaledFnGetter = new Function("s", "k", "pw", code);
            evaledFnGetter.toString = function() {
                return code;
            }, fn = function(scope, locals) {
                return evaledFnGetter(scope, locals, promiseWarning);
            };
        }
        return "hasOwnProperty" !== path && (getterFnCache[path] = fn), fn;
    }
    function $ParseProvider() {
        var cache = {}, $parseOptions = {
            csp: !1,
            unwrapPromises: !1,
            logPromiseWarnings: !0
        };
        this.unwrapPromises = function(value) {
            return isDefined(value) ? ($parseOptions.unwrapPromises = !!value, this) : $parseOptions.unwrapPromises;
        }, this.logPromiseWarnings = function(value) {
            return isDefined(value) ? ($parseOptions.logPromiseWarnings = value, this) : $parseOptions.logPromiseWarnings;
        }, this.$get = [
            "$filter",
            "$sniffer",
            "$log",
            function($filter, $sniffer, $log) {
                return $parseOptions.csp = $sniffer.csp, promiseWarning = function(fullExp) {
                    !$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp) || (promiseWarningCache[fullExp] = !0, $log.warn("[$parse] Promise found in the expression `" + fullExp + "`. Automatic unwrapping of promises in Angular expressions is deprecated."));
                }, function(exp) {
                    var parsedExpression;
                    switch(typeof exp){
                        case "string":
                            if (cache.hasOwnProperty(exp)) return cache[exp];
                            var lexer = new Lexer($parseOptions);
                            return parsedExpression = new Parser(lexer, $filter, $parseOptions).parse(exp, !1), "hasOwnProperty" !== exp && (cache[exp] = parsedExpression), parsedExpression;
                        case "function":
                            return exp;
                        default:
                            return noop;
                    }
                };
            }, 
        ];
    }
    function $QProvider() {
        this.$get = [
            "$rootScope",
            "$exceptionHandler",
            function($rootScope, $exceptionHandler) {
                return qFactory(function(callback) {
                    $rootScope.$evalAsync(callback);
                }, $exceptionHandler);
            }, 
        ];
    }
    function qFactory(nextTick, exceptionHandler) {
        var defer = function() {
            var value1, deferred, pending = [];
            return deferred = {
                resolve: function(val) {
                    if (pending) {
                        var callbacks = pending;
                        pending = undefined, value1 = ref(val), callbacks.length && nextTick(function() {
                            for(var callback, i = 0, ii = callbacks.length; i < ii; i++)callback = callbacks[i], value1.then(callback[0], callback[1], callback[2]);
                        });
                    }
                },
                reject: function(reason) {
                    deferred.resolve(reject(reason));
                },
                notify: function(progress) {
                    if (pending) {
                        var callbacks = pending;
                        pending.length && nextTick(function() {
                            for(var i = 0, ii = callbacks.length; i < ii; i++)(0, callbacks[i])[2](progress);
                        });
                    }
                },
                promise: {
                    then: function(callback, errback, progressback) {
                        var result = defer(), wrappedCallback = function(value) {
                            try {
                                result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
                            } catch (e) {
                                result.reject(e), exceptionHandler(e);
                            }
                        }, wrappedErrback = function(reason) {
                            try {
                                result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
                            } catch (e) {
                                result.reject(e), exceptionHandler(e);
                            }
                        }, wrappedProgressback = function(progress) {
                            try {
                                result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
                            } catch (e) {
                                exceptionHandler(e);
                            }
                        };
                        return pending ? pending.push([
                            wrappedCallback,
                            wrappedErrback,
                            wrappedProgressback, 
                        ]) : value1.then(wrappedCallback, wrappedErrback, wrappedProgressback), result.promise;
                    },
                    catch: function(callback) {
                        return this.then(null, callback);
                    },
                    finally: function(callback) {
                        function makePromise(value, resolved) {
                            var result = defer();
                            return resolved ? result.resolve(value) : result.reject(value), result.promise;
                        }
                        function handleCallback(value, isResolved) {
                            var callbackOutput = null;
                            try {
                                callbackOutput = (callback || defaultCallback)();
                            } catch (e) {
                                return makePromise(e, !1);
                            }
                            return callbackOutput && isFunction(callbackOutput.then) ? callbackOutput.then(function() {
                                return makePromise(value, isResolved);
                            }, function(error) {
                                return makePromise(error, !1);
                            }) : makePromise(value, isResolved);
                        }
                        return this.then(function(value) {
                            return handleCallback(value, !0);
                        }, function(error) {
                            return handleCallback(error, !1);
                        });
                    }
                }
            };
        }, ref = function(value) {
            return value && isFunction(value.then) ? value : {
                then: function(callback) {
                    var result = defer();
                    return nextTick(function() {
                        result.resolve(callback(value));
                    }), result.promise;
                }
            };
        }, reject = function(reason) {
            return {
                then: function(callback, errback) {
                    var result = defer();
                    return nextTick(function() {
                        try {
                            result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
                        } catch (e) {
                            result.reject(e), exceptionHandler(e);
                        }
                    }), result.promise;
                }
            };
        };
        function defaultCallback(value) {
            return value;
        }
        function defaultErrback(reason) {
            return reject(reason);
        }
        return {
            defer: defer,
            reject: reject,
            when: function(value2, callback, errback, progressback) {
                var done, result = defer(), wrappedCallback = function(value) {
                    try {
                        return (isFunction(callback) ? callback : defaultCallback)(value);
                    } catch (e) {
                        return exceptionHandler(e), reject(e);
                    }
                }, wrappedErrback = function(reason) {
                    try {
                        return (isFunction(errback) ? errback : defaultErrback)(reason);
                    } catch (e) {
                        return exceptionHandler(e), reject(e);
                    }
                }, wrappedProgressback = function(progress) {
                    try {
                        return (isFunction(progressback) ? progressback : defaultCallback)(progress);
                    } catch (e) {
                        exceptionHandler(e);
                    }
                };
                return nextTick(function() {
                    ref(value2).then(function(value) {
                        done || (done = !0, result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback)));
                    }, function(reason) {
                        done || (done = !0, result.resolve(wrappedErrback(reason)));
                    }, function(progress) {
                        done || result.notify(wrappedProgressback(progress));
                    });
                }), result.promise;
            },
            all: function(promises) {
                var deferred = defer(), counter = 0, results = isArray(promises) ? [] : {};
                return forEach(promises, function(promise, key) {
                    counter++, ref(promise).then(function(value) {
                        results.hasOwnProperty(key) || (results[key] = value, --counter || deferred.resolve(results));
                    }, function(reason) {
                        results.hasOwnProperty(key) || deferred.reject(reason);
                    });
                }), 0 === counter && deferred.resolve(results), deferred.promise;
            }
        };
    }
    function $RootScopeProvider() {
        var TTL = 10, $rootScopeMinErr = minErr("$rootScope"), lastDirtyWatch = null;
        this.digestTtl = function(value) {
            return arguments.length && (TTL = value), TTL;
        }, this.$get = [
            "$injector",
            "$exceptionHandler",
            "$parse",
            "$browser",
            function($injector, $exceptionHandler, $parse, $browser) {
                function Scope() {
                    this.$id = nextUid(), this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null, this.this = this.$root = this, this.$$destroyed = !1, this.$$asyncQueue = [], this.$$postDigestQueue = [], this.$$listeners = {}, this.$$isolateBindings = {};
                }
                Scope.prototype = {
                    constructor: Scope,
                    $new: function(isolate) {
                        var ChildScope, child;
                        return isolate ? ((child = new Scope()).$root = this.$root, child.$$asyncQueue = this.$$asyncQueue, child.$$postDigestQueue = this.$$postDigestQueue) : ((ChildScope = function() {}).prototype = this, (child = new ChildScope()).$id = nextUid()), child.this = child, child.$$listeners = {}, child.$parent = this, child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null, child.$$prevSibling = this.$$childTail, this.$$childHead ? (this.$$childTail.$$nextSibling = child, this.$$childTail = child) : this.$$childHead = this.$$childTail = child, child;
                    },
                    $watch: function(watchExp, listener, objectEquality) {
                        var scope2 = this, get = compileToFn(watchExp, "watch"), array = scope2.$$watchers, watcher = {
                            fn: listener,
                            last: initWatchVal,
                            get: get,
                            exp: watchExp,
                            eq: !!objectEquality
                        };
                        if (lastDirtyWatch = null, !isFunction(listener)) {
                            var listenFn = compileToFn(listener || noop, "listener");
                            watcher.fn = function(newVal, oldVal, scope) {
                                listenFn(scope);
                            };
                        }
                        if ("string" == typeof watchExp && get.constant) {
                            var originalFn = watcher.fn;
                            watcher.fn = function(newVal, oldVal, scope) {
                                originalFn.call(this, newVal, oldVal, scope), arrayRemove(array, watcher);
                            };
                        }
                        return array || (array = scope2.$$watchers = []), array.unshift(watcher), function() {
                            arrayRemove(array, watcher);
                        };
                    },
                    $watchCollection: function(obj, listener) {
                        var oldValue, newValue, self = this, changeDetected = 0, objGetter = $parse(obj), internalArray = [], internalObject = {}, oldLength = 0;
                        return this.$watch(function() {
                            if (isObject(newValue = objGetter(self))) {
                                if (isArrayLike(newValue)) {
                                    oldValue !== internalArray && (oldLength = (oldValue = internalArray).length = 0, changeDetected++), oldLength !== (newLength = newValue.length) && (changeDetected++, oldValue.length = oldLength = newLength);
                                    for(var newLength, key, i = 0; i < newLength; i++)oldValue[i] !== newValue[i] && (changeDetected++, oldValue[i] = newValue[i]);
                                } else {
                                    for(key in oldValue !== internalObject && (oldValue = internalObject = {}, oldLength = 0, changeDetected++), newLength = 0, newValue)newValue.hasOwnProperty(key) && (newLength++, oldValue.hasOwnProperty(key) ? oldValue[key] !== newValue[key] && (changeDetected++, oldValue[key] = newValue[key]) : (oldLength++, oldValue[key] = newValue[key], changeDetected++));
                                    if (oldLength > newLength) for(key in changeDetected++, oldValue)oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key) && (oldLength--, delete oldValue[key]);
                                }
                            } else oldValue !== newValue && (oldValue = newValue, changeDetected++);
                            return changeDetected;
                        }, function() {
                            listener(newValue, oldValue, self);
                        });
                    },
                    $digest: function() {
                        var watch, value, last, watchers, length, dirty, next, current, logIdx, logMsg, asyncTask, asyncQueue = this.$$asyncQueue, postDigestQueue = this.$$postDigestQueue, ttl = TTL, watchLog = [];
                        beginPhase("$digest"), lastDirtyWatch = null;
                        do {
                            for(dirty = !1, current = this; asyncQueue.length;){
                                try {
                                    (asyncTask = asyncQueue.shift()).scope.$eval(asyncTask.expression);
                                } catch (e) {
                                    clearPhase(), $exceptionHandler(e);
                                }
                                lastDirtyWatch = null;
                            }
                            traverseScopesLoop: do {
                                if (watchers = current.$$watchers) for(length = watchers.length; length--;)try {
                                    if (watch = watchers[length]) {
                                        if ((value = watch.get(current)) === (last = watch.last) || (watch.eq ? equals(value, last) : "number" == typeof value && "number" == typeof last && isNaN(value) && isNaN(last))) {
                                            if (watch === lastDirtyWatch) {
                                                dirty = !1;
                                                break traverseScopesLoop;
                                            }
                                        } else dirty = !0, lastDirtyWatch = watch, watch.last = watch.eq ? copy(value) : value, watch.fn(value, last === initWatchVal ? value : last, current), ttl < 5 && (watchLog[logIdx = 4 - ttl] || (watchLog[logIdx] = []), logMsg = isFunction(watch.exp) ? "fn: " + (watch.exp.name || watch.exp.toString()) : watch.exp, logMsg += "; newVal: " + toJson(value) + "; oldVal: " + toJson(last), watchLog[logIdx].push(logMsg));
                                    }
                                } catch (e) {
                                    clearPhase(), $exceptionHandler(e);
                                }
                                if (!(next = current.$$childHead || current !== this && current.$$nextSibling)) for(; current !== this && !(next = current.$$nextSibling);)current = current.$parent;
                            }while (current = next)
                            if (dirty && !ttl--) throw clearPhase(), $rootScopeMinErr("infdig", "{0} $digest() iterations reached. Aborting!\nWatchers fired in the last 5 iterations: {1}", TTL, toJson(watchLog));
                        }while (dirty || asyncQueue.length)
                        for(clearPhase(); postDigestQueue.length;)try {
                            postDigestQueue.shift()();
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    },
                    $destroy: function() {
                        if (!this.$$destroyed) {
                            var parent = this.$parent;
                            this.$broadcast("$destroy"), this.$$destroyed = !0, this !== $rootScope && (parent.$$childHead == this && (parent.$$childHead = this.$$nextSibling), parent.$$childTail == this && (parent.$$childTail = this.$$prevSibling), this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling), this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling), this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null);
                        }
                    },
                    $eval: function(expr, locals) {
                        return $parse(expr)(this, locals);
                    },
                    $evalAsync: function(expr) {
                        $rootScope.$$phase || $rootScope.$$asyncQueue.length || $browser.defer(function() {
                            $rootScope.$$asyncQueue.length && $rootScope.$digest();
                        }), this.$$asyncQueue.push({
                            scope: this,
                            expression: expr
                        });
                    },
                    $$postDigest: function(fn) {
                        this.$$postDigestQueue.push(fn);
                    },
                    $apply: function(expr) {
                        try {
                            return beginPhase("$apply"), this.$eval(expr);
                        } catch (e) {
                            $exceptionHandler(e);
                        } finally{
                            clearPhase();
                            try {
                                $rootScope.$digest();
                            } catch (e) {
                                throw $exceptionHandler(e), e;
                            }
                        }
                    },
                    $on: function(name, listener) {
                        var namedListeners = this.$$listeners[name];
                        return namedListeners || (this.$$listeners[name] = namedListeners = []), namedListeners.push(listener), function() {
                            namedListeners[indexOf(namedListeners, listener)] = null;
                        };
                    },
                    $emit: function(name, args) {
                        var namedListeners, i, length, empty = [], scope = this, stopPropagation = !1, event = {
                            name: name,
                            targetScope: scope,
                            stopPropagation: function() {
                                stopPropagation = !0;
                            },
                            preventDefault: function() {
                                event.defaultPrevented = !0;
                            },
                            defaultPrevented: !1
                        }, listenerArgs = concat1([
                            event
                        ], arguments, 1);
                        do {
                            for(i = 0, namedListeners = scope.$$listeners[name] || empty, event.currentScope = scope, length = namedListeners.length; i < length; i++){
                                if (!namedListeners[i]) {
                                    namedListeners.splice(i, 1), i--, length--;
                                    continue;
                                }
                                try {
                                    namedListeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            if (stopPropagation) break;
                            scope = scope.$parent;
                        }while (scope)
                        return event;
                    },
                    $broadcast: function(name, args) {
                        var listeners, i, length, target = this, current = target, next = target, event = {
                            name: name,
                            targetScope: target,
                            preventDefault: function() {
                                event.defaultPrevented = !0;
                            },
                            defaultPrevented: !1
                        }, listenerArgs = concat1([
                            event
                        ], arguments, 1);
                        do {
                            for(i = 0, current = next, event.currentScope = current, length = (listeners = current.$$listeners[name] || []).length; i < length; i++){
                                if (!listeners[i]) {
                                    listeners.splice(i, 1), i--, length--;
                                    continue;
                                }
                                try {
                                    listeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) for(; current !== target && !(next = current.$$nextSibling);)current = current.$parent;
                        }while (current = next)
                        return event;
                    }
                };
                var $rootScope = new Scope();
                return $rootScope;
                function beginPhase(phase) {
                    if ($rootScope.$$phase) throw $rootScopeMinErr("inprog", "{0} already in progress", $rootScope.$$phase);
                    $rootScope.$$phase = phase;
                }
                function clearPhase() {
                    $rootScope.$$phase = null;
                }
                function compileToFn(exp, name) {
                    var fn = $parse(exp);
                    return assertArgFn(fn, name), fn;
                }
                function initWatchVal() {}
            }, 
        ];
    }
    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
        this.aHrefSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (aHrefSanitizationWhitelist = regexp, this) : aHrefSanitizationWhitelist;
        }, this.imgSrcSanitizationWhitelist = function(regexp) {
            return isDefined(regexp) ? (imgSrcSanitizationWhitelist = regexp, this) : imgSrcSanitizationWhitelist;
        }, this.$get = function() {
            return function(uri, isImage) {
                var normalizedVal, regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                return msie && !(msie >= 8) || "" === (normalizedVal = urlResolve(uri).href) || normalizedVal.match(regex) ? uri : "unsafe:" + normalizedVal;
            };
        };
    }
    var $sceMinErr = minErr("$sce"), SCE_CONTEXTS = {
        HTML: "html",
        CSS: "css",
        URL: "url",
        RESOURCE_URL: "resourceUrl",
        JS: "js"
    };
    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        return isDefined(matchers) && forEach(matchers, function(matcher1) {
            adjustedMatchers.push(function(matcher) {
                if ("self" === matcher) return matcher;
                if (isString(matcher)) {
                    var s;
                    if (matcher.indexOf("***") > -1) throw $sceMinErr("iwcard", "Illegal sequence *** in string matcher.  String: {0}", matcher);
                    return matcher = matcher.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08").replace("\\*\\*", ".*").replace("\\*", "[^:/.?&;]*"), new RegExp("^" + matcher + "$");
                }
                if (isRegExp(matcher)) return new RegExp("^" + matcher.source + "$");
                throw $sceMinErr("imatcher", 'Matchers may only be "self", string patterns or RegExp objects');
            }(matcher1));
        }), adjustedMatchers;
    }
    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = [
            "self"
        ], resourceUrlBlacklist = [];
        this.resourceUrlWhitelist = function(value) {
            return arguments.length && (resourceUrlWhitelist = adjustMatchers(value)), resourceUrlWhitelist;
        }, this.resourceUrlBlacklist = function(value) {
            return arguments.length && (resourceUrlBlacklist = adjustMatchers(value)), resourceUrlBlacklist;
        }, this.$get = [
            "$injector",
            function($injector) {
                var htmlSanitizer = function(html) {
                    throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
                };
                function matchUrl(matcher, parsedUrl) {
                    return "self" === matcher ? urlIsSameOrigin(parsedUrl) : !!matcher.exec(parsedUrl.href);
                }
                function generateHolderType(Base) {
                    var holderType = function(trustedValue) {
                        this.$$unwrapTrustedValue = function() {
                            return trustedValue;
                        };
                    };
                    return Base && (holderType.prototype = new Base()), holderType.prototype.valueOf = function() {
                        return this.$$unwrapTrustedValue();
                    }, holderType.prototype.toString = function() {
                        return this.$$unwrapTrustedValue().toString();
                    }, holderType;
                }
                $injector.has("$sanitize") && (htmlSanitizer = $injector.get("$sanitize"));
                var trustedValueHolderBase = generateHolderType(), byType = {};
                return byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase), byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]), {
                    trustAs: function(type, trustedValue) {
                        var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                        if (!Constructor) throw $sceMinErr("icontext", "Attempted to trust a value in invalid context. Context: {0}; Value: {1}", type, trustedValue);
                        if (null === trustedValue || trustedValue === undefined || "" === trustedValue) return trustedValue;
                        if ("string" != typeof trustedValue) throw $sceMinErr("itype", "Attempted to trust a non-string value in a content requiring a string: Context: {0}", type);
                        return new Constructor(trustedValue);
                    },
                    getTrusted: function(type, maybeTrusted) {
                        if (null === maybeTrusted || maybeTrusted === undefined || "" === maybeTrusted) return maybeTrusted;
                        var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
                        if (constructor && maybeTrusted instanceof constructor) return maybeTrusted.$$unwrapTrustedValue();
                        if (type === SCE_CONTEXTS.RESOURCE_URL) {
                            if (function(url) {
                                var i, n, parsedUrl = urlResolve(url.toString()), allowed = !1;
                                for(i = 0, n = resourceUrlWhitelist.length; i < n; i++)if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                                    allowed = !0;
                                    break;
                                }
                                if (allowed) {
                                    for(i = 0, n = resourceUrlBlacklist.length; i < n; i++)if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                                        allowed = !1;
                                        break;
                                    }
                                }
                                return allowed;
                            }(maybeTrusted)) return maybeTrusted;
                            throw $sceMinErr("insecurl", "Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}", maybeTrusted.toString());
                        }
                        if (type === SCE_CONTEXTS.HTML) return htmlSanitizer(maybeTrusted);
                        throw $sceMinErr("unsafe", "Attempting to use an unsafe value in a safe context.");
                    },
                    valueOf: function(maybeTrusted) {
                        return maybeTrusted instanceof trustedValueHolderBase ? maybeTrusted.$$unwrapTrustedValue() : maybeTrusted;
                    }
                };
            }, 
        ];
    }
    function $SceProvider() {
        var enabled = !0;
        this.enabled = function(value) {
            return arguments.length && (enabled = !!value), enabled;
        }, this.$get = [
            "$parse",
            "$sniffer",
            "$sceDelegate",
            function($parse, $sniffer, $sceDelegate) {
                if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) throw $sceMinErr("iequirks", "Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks mode.  You can fix this by adding the text <!doctype html> to the top of your HTML document.  See http://docs.angularjs.org/api/ng.$sce for more information.");
                var sce = copy(SCE_CONTEXTS);
                sce.isEnabled = function() {
                    return enabled;
                }, sce.trustAs = $sceDelegate.trustAs, sce.getTrusted = $sceDelegate.getTrusted, sce.valueOf = $sceDelegate.valueOf, enabled || (sce.trustAs = sce.getTrusted = function(type, value) {
                    return value;
                }, sce.valueOf = identity), sce.parseAs = function(type, expr) {
                    var parsed = $parse(expr);
                    return parsed.literal && parsed.constant ? parsed : function(self, locals) {
                        return sce.getTrusted(type, parsed(self, locals));
                    };
                };
                var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
                return forEach(SCE_CONTEXTS, function(enumValue, name) {
                    var lName = lowercase(name);
                    sce[camelCase("parse_as_" + lName)] = function(expr) {
                        return parse(enumValue, expr);
                    }, sce[camelCase("get_trusted_" + lName)] = function(value) {
                        return getTrusted(enumValue, value);
                    }, sce[camelCase("trust_as_" + lName)] = function(value) {
                        return trustAs(enumValue, value);
                    };
                }), sce;
            }, 
        ];
    }
    function $SnifferProvider() {
        this.$get = [
            "$window",
            "$document",
            function($window, $document) {
                var vendorPrefix, match, eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, documentMode = document.documentMode, vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = !1, animations = !1;
                if (bodyStyle) {
                    for(var prop in bodyStyle)if (match = vendorRegex.exec(prop)) {
                        vendorPrefix = (vendorPrefix = match[0]).substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                        break;
                    }
                    vendorPrefix || (vendorPrefix = "WebkitOpacity" in bodyStyle && "webkit"), transitions = !!("transition" in bodyStyle || vendorPrefix + "Transition" in bodyStyle), animations = !!("animation" in bodyStyle || vendorPrefix + "Animation" in bodyStyle), !android || transitions && animations || (transitions = isString(document.body.style.webkitTransition), animations = isString(document.body.style.webkitAnimation));
                }
                return {
                    history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
                    hashchange: "onhashchange" in $window && (!documentMode || documentMode > 7),
                    hasEvent: function(event) {
                        if ("input" == event && 9 == msie) return !1;
                        if (isUndefined(eventSupport[event])) {
                            var divElm = document.createElement("div");
                            eventSupport[event] = "on" + event in divElm;
                        }
                        return eventSupport[event];
                    },
                    csp: csp(),
                    vendorPrefix: vendorPrefix,
                    transitions: transitions,
                    animations: animations,
                    msie: msie,
                    msieDocumentMode: documentMode
                };
            }, 
        ];
    }
    function $TimeoutProvider() {
        this.$get = [
            "$rootScope",
            "$browser",
            "$q",
            "$exceptionHandler",
            function($rootScope, $browser, $q, $exceptionHandler) {
                var deferreds = {};
                function timeout(fn, delay, invokeApply) {
                    var timeoutId, deferred = $q.defer(), promise = deferred.promise, skipApply = isDefined(invokeApply) && !invokeApply;
                    return timeoutId = $browser.defer(function() {
                        try {
                            deferred.resolve(fn());
                        } catch (e) {
                            deferred.reject(e), $exceptionHandler(e);
                        } finally{
                            delete deferreds[promise.$$timeoutId];
                        }
                        skipApply || $rootScope.$apply();
                    }, delay), promise.$$timeoutId = timeoutId, deferreds[timeoutId] = deferred, promise;
                }
                return timeout.cancel = function(promise) {
                    return !!promise && promise.$$timeoutId in deferreds && (deferreds[promise.$$timeoutId].reject("canceled"), delete deferreds[promise.$$timeoutId], $browser.defer.cancel(promise.$$timeoutId));
                }, timeout;
            }, 
        ];
    }
    var urlParsingNode = document1.createElement("a"), originUrl = urlResolve(window1.location.href, !0);
    function urlResolve(url, base) {
        var href = url;
        return msie && (urlParsingNode.setAttribute("href", href), href = urlParsingNode.href), urlParsingNode.setAttribute("href", href), {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: "/" === urlParsingNode.pathname.charAt(0) ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    function urlIsSameOrigin(requestUrl) {
        var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
        return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
    }
    function $WindowProvider() {
        this.$get = valueFn1(window1);
    }
    function $FilterProvider($provide) {
        var suffix = "Filter";
        function register(name, factory) {
            if (!isObject(name)) return $provide.factory(name + suffix, factory);
            var filters = {};
            return forEach(name, function(filter, key) {
                filters[key] = register(key, filter);
            }), filters;
        }
        this.register = register, this.$get = [
            "$injector",
            function($injector) {
                return function(name) {
                    return $injector.get(name + suffix);
                };
            }, 
        ], register("currency", currencyFilter), register("date", dateFilter), register("filter", filterFilter), register("json", jsonFilter), register("limitTo", limitToFilter), register("lowercase", lowercaseFilter), register("number", numberFilter), register("orderBy", orderByFilter), register("uppercase", uppercaseFilter);
    }
    function filterFilter() {
        return function(array, expression, comparator) {
            if (!isArray(array)) return array;
            var comparatorType = typeof comparator, predicates = [];
            predicates.check = function(value) {
                for(var j = 0; j < predicates.length; j++)if (!predicates[j](value)) return !1;
                return !0;
            }, "function" !== comparatorType && (comparator = "boolean" === comparatorType && comparator ? function(obj, text) {
                return angular1.equals(obj, text);
            } : function(obj, text) {
                return text = ("" + text).toLowerCase(), ("" + obj).toLowerCase().indexOf(text) > -1;
            });
            var search = function(obj, text) {
                if ("string" == typeof text && "!" === text.charAt(0)) return !search(obj, text.substr(1));
                switch(typeof obj){
                    case "boolean":
                    case "number":
                    case "string":
                        return comparator(obj, text);
                    case "object":
                        if ("object" == typeof text) return comparator(obj, text);
                        for(var objKey in obj)if ("$" !== objKey.charAt(0) && search(obj[objKey], text)) return !0;
                        return !1;
                    case "array":
                        for(var i = 0; i < obj.length; i++)if (search(obj[i], text)) return !0;
                        return !1;
                    default:
                        return !1;
                }
            };
            switch(typeof expression){
                case "boolean":
                case "number":
                case "string":
                    expression = {
                        $: expression
                    };
                case "object":
                    for(var key in expression)"$" == key ? function() {
                        if (expression[key]) {
                            var path = key;
                            predicates.push(function(value) {
                                return search(value, expression[path]);
                            });
                        }
                    }() : function() {
                        if (void 0 !== expression[key]) {
                            var path = key;
                            predicates.push(function(value) {
                                return search(getter1(value, path), expression[path]);
                            });
                        }
                    }();
                    break;
                case "function":
                    predicates.push(expression);
                    break;
                default:
                    return array;
            }
            for(var filtered = [], j1 = 0; j1 < array.length; j1++){
                var value3 = array[j1];
                predicates.check(value3) && filtered.push(value3);
            }
            return filtered;
        };
    }
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
            return isUndefined(currencySymbol) && (currencySymbol = formats.CURRENCY_SYM), formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol);
        };
    }
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function(number, fractionSize) {
            return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
        };
    }
    $FilterProvider.$inject = [
        "$provide"
    ], currencyFilter.$inject = [
        "$locale"
    ], numberFilter.$inject = [
        "$locale"
    ];
    var DECIMAL_SEP = ".";
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (isNaN(number) || !isFinite(number)) return "";
        var isNegative = number < 0, numStr = (number = Math.abs(number)) + "", formatedText = "", parts = [], hasExponent = !1;
        if (-1 !== numStr.indexOf("e")) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            match && "-" == match[2] && match[3] > fractionSize + 1 ? numStr = "0" : (formatedText = numStr, hasExponent = !0);
        }
        if (hasExponent) fractionSize > 0 && number > -1 && number < 1 && (formatedText = number.toFixed(fractionSize));
        else {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || "").length;
            isUndefined(fractionSize) && (fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac));
            var pow = Math.pow(10, fractionSize), fraction = ("" + (number = Math.round(number * pow) / pow)).split(DECIMAL_SEP), whole = fraction[0];
            fraction = fraction[1] || "";
            var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
            if (whole.length >= lgroup + group) for(i = 0, pos = whole.length - lgroup; i < pos; i++)(pos - i) % group == 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for(i = pos; i < whole.length; i++)(whole.length - i) % lgroup == 0 && 0 !== i && (formatedText += groupSep), formatedText += whole.charAt(i);
            for(; fraction.length < fractionSize;)fraction += "0";
            fractionSize && "0" !== fractionSize && (formatedText += decimalSep + fraction.substr(0, fractionSize));
        }
        return parts.push(isNegative ? pattern.negPre : pattern.posPre), parts.push(formatedText), parts.push(isNegative ? pattern.negSuf : pattern.posSuf), parts.join("");
    }
    function padNumber(num, digits, trim) {
        var neg = "";
        for(num < 0 && (neg = "-", num = -num), num = "" + num; num.length < digits;)num = "0" + num;
        return trim && (num = num.substr(num.length - digits)), neg + num;
    }
    function dateGetter(name, size, offset, trim) {
        return offset = offset || 0, function(date) {
            var value = date["get" + name]();
            return (offset > 0 || value > -offset) && (value += offset), 0 === value && -12 == offset && (value = 12), padNumber(value, size, trim);
        };
    }
    function dateStrGetter(name, shortForm) {
        return function(date, formats) {
            var value = date["get" + name]();
            return formats[uppercase(shortForm ? "SHORT" + name : name)][value];
        };
    }
    var DATE_FORMATS = {
        yyyy: dateGetter("FullYear", 4),
        yy: dateGetter("FullYear", 2, 0, !0),
        y: dateGetter("FullYear", 1),
        MMMM: dateStrGetter("Month"),
        MMM: dateStrGetter("Month", !0),
        MM: dateGetter("Month", 2, 1),
        M: dateGetter("Month", 1, 1),
        dd: dateGetter("Date", 2),
        d: dateGetter("Date", 1),
        HH: dateGetter("Hours", 2),
        H: dateGetter("Hours", 1),
        hh: dateGetter("Hours", 2, -12),
        h: dateGetter("Hours", 1, -12),
        mm: dateGetter("Minutes", 2),
        m: dateGetter("Minutes", 1),
        ss: dateGetter("Seconds", 2),
        s: dateGetter("Seconds", 1),
        sss: dateGetter("Milliseconds", 3),
        EEEE: dateStrGetter("Day"),
        EEE: dateStrGetter("Day", !0),
        a: function(date, formats) {
            return 12 > date.getHours() ? formats.AMPMS[0] : formats.AMPMS[1];
        },
        Z: function(date) {
            var zone = -1 * date.getTimezoneOffset();
            return (zone >= 0 ? "+" : "") + (padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2));
        }
    }, DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, NUMBER_STRING = /^\-?\d+$/;
    function dateFilter($locale) {
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
        return function(date1, format) {
            var fn, match1, text = "", parts = [];
            if (format = format || "mediumDate", format = $locale.DATETIME_FORMATS[format] || format, isString(date1) && (date1 = NUMBER_STRING.test(date1) ? int(date1) : function(string) {
                var match;
                if (match = string.match(R_ISO8601_STR)) {
                    var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
                    match[9] && (tzHour = int(match[9] + match[10]), tzMin = int(match[9] + match[11])), dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                    var h = int(match[4] || 0) - tzHour, m = int(match[5] || 0) - tzMin, s = int(match[6] || 0), ms = Math.round(1000 * parseFloat("0." + (match[7] || 0)));
                    return timeSetter.call(date, h, m, s, ms), date;
                }
                return string;
            }(date1)), isNumber(date1) && (date1 = new Date(date1)), !isDate(date1)) return date1;
            for(; format;)(match1 = DATE_FORMATS_SPLIT.exec(format)) ? format = (parts = concat1(parts, match1, 1)).pop() : (parts.push(format), format = null);
            return forEach(parts, function(value) {
                text += (fn = DATE_FORMATS[value]) ? fn(date1, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'");
            }), text;
        };
    }
    function jsonFilter() {
        return function(object) {
            return toJson(object, !0);
        };
    }
    dateFilter.$inject = [
        "$locale"
    ];
    var lowercaseFilter = valueFn1(lowercase), uppercaseFilter = valueFn1(uppercase);
    function limitToFilter() {
        return function(input, limit) {
            if (!isArray(input) && !isString(input)) return input;
            if (limit = int(limit), isString(input)) return limit ? limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length) : "";
            var i, n, out = [];
            for(limit > input.length ? limit = input.length : limit < -input.length && (limit = -input.length), limit > 0 ? (i = 0, n = limit) : (i = input.length + limit, n = input.length); i < n; i++)out.push(input[i]);
            return out;
        };
    }
    function orderByFilter($parse) {
        return function(array, sortPredicate, reverseOrder) {
            if (!isArray(array) || !sortPredicate) return array;
            sortPredicate = function(obj, iterator, context) {
                var results = [];
                return forEach(obj, function(value, index, list) {
                    results.push(iterator.call(void 0, value, index, list));
                }), results;
            }(sortPredicate = isArray(sortPredicate) ? sortPredicate : [
                sortPredicate
            ], function(predicate) {
                var descending = !1, get = predicate || identity;
                return isString(predicate) && (("+" == predicate.charAt(0) || "-" == predicate.charAt(0)) && (descending = "-" == predicate.charAt(0), predicate = predicate.substring(1)), get = $parse(predicate)), reverseComparator(function(a, b) {
                    return compare(get(a), get(b));
                }, descending);
            });
            for(var arrayCopy = [], i3 = 0; i3 < array.length; i3++)arrayCopy.push(array[i3]);
            return arrayCopy.sort(reverseComparator(function(o1, o2) {
                for(var i = 0; i < sortPredicate.length; i++){
                    var comp = sortPredicate[i](o1, o2);
                    if (0 !== comp) return comp;
                }
                return 0;
            }, reverseOrder));
            function reverseComparator(comp, descending) {
                return toBoolean(descending) ? function(a, b) {
                    return comp(b, a);
                } : comp;
            }
            function compare(v1, v2) {
                var t1 = typeof v1, t2 = typeof v2;
                return t1 != t2 ? t1 < t2 ? -1 : 1 : ("string" == t1 && (v1 = v1.toLowerCase(), v2 = v2.toLowerCase()), v1 === v2) ? 0 : v1 < v2 ? -1 : 1;
            }
        };
    }
    function ngDirective(directive) {
        return isFunction(directive) && (directive = {
            link: directive
        }), directive.restrict = directive.restrict || "AC", valueFn1(directive);
    }
    orderByFilter.$inject = [
        "$parse"
    ];
    var htmlAnchorDirective = valueFn1({
        restrict: "E",
        compile: function(element6, attr) {
            if (msie <= 8 && (attr.href || attr.name || attr.$set("href", ""), element6.append(document1.createComment("IE fix"))), !attr.href && !attr.name) return function(scope, element) {
                element.on("click", function(event) {
                    element.attr("href") || event.preventDefault();
                });
            };
        }
    }), ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
        if ("multiple" != propName) {
            var normalized = directiveNormalize("ng-" + attrName);
            ngAttributeAliasDirectives[normalized] = function() {
                return {
                    priority: 100,
                    compile: function() {
                        return function(scope, element, attr) {
                            scope.$watch(attr[normalized], function(value) {
                                attr.$set(attrName, !!value);
                            });
                        };
                    }
                };
            };
        }
    }), forEach([
        "src",
        "srcset",
        "href"
    ], function(attrName) {
        var normalized = directiveNormalize("ng-" + attrName);
        ngAttributeAliasDirectives[normalized] = function() {
            return {
                priority: 99,
                link: function(scope, element, attr) {
                    attr.$observe(normalized, function(value) {
                        value && (attr.$set(attrName, value), msie && element.prop(attrName, attr[attrName]));
                    });
                }
            };
        };
    });
    var nullFormCtrl = {
        $addControl: noop,
        $removeControl: noop,
        $setValidity: noop,
        $setDirty: noop,
        $setPristine: noop
    };
    function FormController(element, attrs) {
        var form = this, parentForm = element.parent().controller("form") || nullFormCtrl, invalidCount = 0, errors = form.$error = {}, controls = [];
        function toggleValidCss(isValid, validationErrorKey) {
            validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
        }
        form.$name = attrs.name || attrs.ngForm, form.$dirty = !1, form.$pristine = !0, form.$valid = !0, form.$invalid = !1, parentForm.$addControl(form), element.addClass(PRISTINE_CLASS), toggleValidCss(!0), form.$addControl = function(control) {
            assertNotHasOwnProperty(control.$name, "input"), controls.push(control), control.$name && (form[control.$name] = control);
        }, form.$removeControl = function(control) {
            control.$name && form[control.$name] === control && delete form[control.$name], forEach(errors, function(queue, validationToken) {
                form.$setValidity(validationToken, !0, control);
            }), arrayRemove(controls, control);
        }, form.$setValidity = function(validationToken, isValid, control) {
            var array, obj, queue = errors[validationToken];
            if (isValid) queue && (arrayRemove(queue, control), queue.length || (--invalidCount || (toggleValidCss(isValid), form.$valid = !0, form.$invalid = !1), errors[validationToken] = !1, toggleValidCss(!0, validationToken), parentForm.$setValidity(validationToken, !0, form)));
            else {
                if (invalidCount || toggleValidCss(isValid), queue) {
                    if (-1 != indexOf(array = queue, control)) return;
                } else errors[validationToken] = queue = [], invalidCount++, toggleValidCss(!1, validationToken), parentForm.$setValidity(validationToken, !1, form);
                queue.push(control), form.$valid = !1, form.$invalid = !0;
            }
        }, form.$setDirty = function() {
            element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS), form.$dirty = !0, form.$pristine = !1, parentForm.$setDirty();
        }, form.$setPristine = function() {
            element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS), form.$dirty = !1, form.$pristine = !0, forEach(controls, function(control) {
                control.$setPristine();
            });
        };
    }
    FormController.$inject = [
        "$element",
        "$attrs",
        "$scope"
    ];
    var formDirectiveFactory = function(isNgForm) {
        return [
            "$timeout",
            function($timeout) {
                return {
                    name: "form",
                    restrict: isNgForm ? "EAC" : "E",
                    controller: FormController,
                    compile: function() {
                        return {
                            pre: function(scope, formElement, attr, controller) {
                                if (!attr.action) {
                                    var preventDefaultListener = function(event) {
                                        event.preventDefault ? event.preventDefault() : event.returnValue = !1;
                                    };
                                    addEventListenerFn(formElement[0], "submit", preventDefaultListener), formElement.on("$destroy", function() {
                                        $timeout(function() {
                                            removeEventListenerFn(formElement[0], "submit", preventDefaultListener);
                                        }, 0, !1);
                                    });
                                }
                                var parentFormCtrl = formElement.parent().controller("form"), alias = attr.name || attr.ngForm;
                                alias && setter(scope, alias, controller, alias), parentFormCtrl && formElement.on("$destroy", function() {
                                    parentFormCtrl.$removeControl(controller), alias && setter(scope, alias, undefined, alias), extend(controller, nullFormCtrl);
                                });
                            }
                        };
                    }
                };
            }, 
        ];
    }, formDirective = formDirectiveFactory(), ngFormDirective = formDirectiveFactory(!0), URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/, NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/, inputType = {
        text: textInputType,
        number: function(scope, element, attr, ctrl, $sniffer, $browser) {
            if (textInputType(scope, element, attr, ctrl, $sniffer, $browser), ctrl.$parsers.push(function(value) {
                var empty = ctrl.$isEmpty(value);
                if (empty || NUMBER_REGEXP.test(value)) return ctrl.$setValidity("number", !0), "" === value ? null : empty ? value : parseFloat(value);
                ctrl.$setValidity("number", !1);
            }), ctrl.$formatters.push(function(value) {
                return ctrl.$isEmpty(value) ? "" : "" + value;
            }), attr.min) {
                var minValidator = function(value) {
                    var min = parseFloat(attr.min);
                    if (ctrl.$isEmpty(value) || !(value < min)) return ctrl.$setValidity("min", !0), value;
                    ctrl.$setValidity("min", !1);
                };
                ctrl.$parsers.push(minValidator), ctrl.$formatters.push(minValidator);
            }
            if (attr.max) {
                var maxValidator = function(value) {
                    var max = parseFloat(attr.max);
                    if (ctrl.$isEmpty(value) || !(value > max)) return ctrl.$setValidity("max", !0), value;
                    ctrl.$setValidity("max", !1);
                };
                ctrl.$parsers.push(maxValidator), ctrl.$formatters.push(maxValidator);
            }
            ctrl.$formatters.push(function(value) {
                if (ctrl.$isEmpty(value) || isNumber(value)) return ctrl.$setValidity("number", !0), value;
                ctrl.$setValidity("number", !1);
            });
        },
        url: function(scope, element, attr, ctrl, $sniffer, $browser) {
            textInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var urlValidator = function(value) {
                if (ctrl.$isEmpty(value) || URL_REGEXP.test(value)) return ctrl.$setValidity("url", !0), value;
                ctrl.$setValidity("url", !1);
            };
            ctrl.$formatters.push(urlValidator), ctrl.$parsers.push(urlValidator);
        },
        email: function(scope, element, attr, ctrl, $sniffer, $browser) {
            textInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var emailValidator = function(value) {
                if (ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value)) return ctrl.$setValidity("email", !0), value;
                ctrl.$setValidity("email", !1);
            };
            ctrl.$formatters.push(emailValidator), ctrl.$parsers.push(emailValidator);
        },
        radio: function(scope, element, attr, ctrl) {
            isUndefined(attr.name) && element.attr("name", nextUid()), element.on("click", function() {
                element[0].checked && scope.$apply(function() {
                    ctrl.$setViewValue(attr.value);
                });
            }), ctrl.$render = function() {
                var value = attr.value;
                element[0].checked = value == ctrl.$viewValue;
            }, attr.$observe("value", ctrl.$render);
        },
        checkbox: function(scope, element, attr, ctrl) {
            var trueValue = attr.ngTrueValue, falseValue = attr.ngFalseValue;
            isString(trueValue) || (trueValue = !0), isString(falseValue) || (falseValue = !1), element.on("click", function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(element[0].checked);
                });
            }), ctrl.$render = function() {
                element[0].checked = ctrl.$viewValue;
            }, ctrl.$isEmpty = function(value) {
                return value !== trueValue;
            }, ctrl.$formatters.push(function(value) {
                return value === trueValue;
            }), ctrl.$parsers.push(function(value) {
                return value ? trueValue : falseValue;
            });
        },
        hidden: noop,
        button: noop,
        submit: noop,
        reset: noop
    };
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var composing = !1;
        element.on("compositionstart", function() {
            composing = !0;
        }), element.on("compositionend", function() {
            composing = !1;
        });
        var listener = function() {
            if (!composing) {
                var value = element.val();
                toBoolean(attr.ngTrim || "T") && (value = trim1(value)), ctrl.$viewValue !== value && scope.$apply(function() {
                    ctrl.$setViewValue(value);
                });
            }
        };
        if ($sniffer.hasEvent("input")) element.on("input", listener);
        else {
            var timeout, deferListener = function() {
                timeout || (timeout = $browser.defer(function() {
                    listener(), timeout = null;
                }));
            };
            element.on("keydown", function(event) {
                var key = event.keyCode;
                91 === key || 15 < key && key < 19 || 37 <= key && key <= 40 || deferListener();
            }), $sniffer.hasEvent("paste") && element.on("paste cut", deferListener);
        }
        element.on("change", listener), ctrl.$render = function() {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
        };
        var patternValidator, match, pattern = attr.ngPattern, validate = function(regexp, value) {
            if (ctrl.$isEmpty(value) || regexp.test(value)) return ctrl.$setValidity("pattern", !0), value;
            ctrl.$setValidity("pattern", !1);
        };
        if (pattern && ((match = pattern.match(/^\/(.*)\/([gim]*)$/)) ? (pattern = new RegExp(match[1], match[2]), patternValidator = function(value) {
            return validate(pattern, value);
        }) : patternValidator = function(value) {
            var patternObj = scope.$eval(pattern);
            if (!patternObj || !patternObj.test) throw minErr("ngPattern")("noregexp", "Expected {0} to be a RegExp but was {1}. Element: {2}", pattern, patternObj, startingTag(element));
            return validate(patternObj, value);
        }, ctrl.$formatters.push(patternValidator), ctrl.$parsers.push(patternValidator)), attr.ngMinlength) {
            var minlength = int(attr.ngMinlength), minLengthValidator = function(value) {
                if (ctrl.$isEmpty(value) || !(value.length < minlength)) return ctrl.$setValidity("minlength", !0), value;
                ctrl.$setValidity("minlength", !1);
            };
            ctrl.$parsers.push(minLengthValidator), ctrl.$formatters.push(minLengthValidator);
        }
        if (attr.ngMaxlength) {
            var maxlength = int(attr.ngMaxlength), maxLengthValidator = function(value) {
                if (ctrl.$isEmpty(value) || !(value.length > maxlength)) return ctrl.$setValidity("maxlength", !0), value;
                ctrl.$setValidity("maxlength", !1);
            };
            ctrl.$parsers.push(maxLengthValidator), ctrl.$formatters.push(maxLengthValidator);
        }
    }
    var inputDirective = [
        "$browser",
        "$sniffer",
        function($browser, $sniffer) {
            return {
                restrict: "E",
                require: "?ngModel",
                link: function(scope, element, attr, ctrl) {
                    ctrl && (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser);
                }
            };
        }, 
    ], VALID_CLASS = "ng-valid", INVALID_CLASS = "ng-invalid", PRISTINE_CLASS = "ng-pristine", DIRTY_CLASS = "ng-dirty", NgModelController = [
        "$scope",
        "$exceptionHandler",
        "$attrs",
        "$element",
        "$parse",
        function($scope, $exceptionHandler, $attr, $element, $parse) {
            this.$viewValue = Number.NaN, this.$modelValue = Number.NaN, this.$parsers = [], this.$formatters = [], this.$viewChangeListeners = [], this.$pristine = !0, this.$dirty = !1, this.$valid = !0, this.$invalid = !1, this.$name = $attr.name;
            var ngModelGet = $parse($attr.ngModel), ngModelSet = ngModelGet.assign;
            if (!ngModelSet) throw minErr("ngModel")("nonassign", "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
            this.$render = noop, this.$isEmpty = function(value) {
                return isUndefined(value) || "" === value || null === value || value != value;
            };
            var parentForm = $element.inheritedData("$formController") || nullFormCtrl, invalidCount = 0, $error = this.$error = {};
            function toggleValidCss(isValid, validationErrorKey) {
                validationErrorKey = validationErrorKey ? "-" + snake_case(validationErrorKey, "-") : "", $element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
            }
            $element.addClass(PRISTINE_CLASS), toggleValidCss(!0), this.$setValidity = function(validationErrorKey, isValid) {
                !isValid !== $error[validationErrorKey] && (isValid ? ($error[validationErrorKey] && invalidCount--, invalidCount || (toggleValidCss(!0), this.$valid = !0, this.$invalid = !1)) : (toggleValidCss(!1), this.$invalid = !0, this.$valid = !1, invalidCount++), $error[validationErrorKey] = !isValid, toggleValidCss(isValid, validationErrorKey), parentForm.$setValidity(validationErrorKey, isValid, this));
            }, this.$setPristine = function() {
                this.$dirty = !1, this.$pristine = !0, $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
            }, this.$setViewValue = function(value) {
                this.$viewValue = value, this.$pristine && (this.$dirty = !0, this.$pristine = !1, $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS), parentForm.$setDirty()), forEach(this.$parsers, function(fn) {
                    value = fn(value);
                }), this.$modelValue !== value && (this.$modelValue = value, ngModelSet($scope, value), forEach(this.$viewChangeListeners, function(listener) {
                    try {
                        listener();
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                }));
            };
            var ctrl = this;
            $scope.$watch(function() {
                var value = ngModelGet($scope);
                if (ctrl.$modelValue !== value) {
                    var formatters = ctrl.$formatters, idx = formatters.length;
                    for(ctrl.$modelValue = value; idx--;)value = formatters[idx](value);
                    ctrl.$viewValue !== value && (ctrl.$viewValue = value, ctrl.$render());
                }
                return value;
            });
        }, 
    ], ngModelDirective = function() {
        return {
            require: [
                "ngModel",
                "^?form"
            ],
            controller: NgModelController,
            link: function(scope, element, attr, ctrls) {
                var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
                formCtrl.$addControl(modelCtrl), scope.$on("$destroy", function() {
                    formCtrl.$removeControl(modelCtrl);
                });
            }
        };
    }, ngChangeDirective = valueFn1({
        require: "ngModel",
        link: function(scope, element, attr, ctrl) {
            ctrl.$viewChangeListeners.push(function() {
                scope.$eval(attr.ngChange);
            });
        }
    }), requiredDirective = function() {
        return {
            require: "?ngModel",
            link: function(scope, elm, attr, ctrl) {
                if (ctrl) {
                    attr.required = !0;
                    var validator = function(value) {
                        if (!(attr.required && ctrl.$isEmpty(value))) return ctrl.$setValidity("required", !0), value;
                        ctrl.$setValidity("required", !1);
                    };
                    ctrl.$formatters.push(validator), ctrl.$parsers.unshift(validator), attr.$observe("required", function() {
                        validator(ctrl.$viewValue);
                    });
                }
            }
        };
    }, ngListDirective = function() {
        return {
            require: "ngModel",
            link: function(scope, element, attr, ctrl) {
                var match = /\/(.*)\//.exec(attr.ngList), separator = match && new RegExp(match[1]) || attr.ngList || ",";
                ctrl.$parsers.push(function(viewValue) {
                    if (!isUndefined(viewValue)) {
                        var list = [];
                        return viewValue && forEach(viewValue.split(separator), function(value) {
                            value && list.push(trim1(value));
                        }), list;
                    }
                }), ctrl.$formatters.push(function(value) {
                    if (isArray(value)) return value.join(", ");
                }), ctrl.$isEmpty = function(value) {
                    return !value || !value.length;
                };
            }
        };
    }, CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/, ngBindDirective = ngDirective(function(scope, element, attr) {
        element.addClass("ng-binding").data("$binding", attr.ngBind), scope.$watch(attr.ngBind, function(value) {
            element.text(value == undefined ? "" : value);
        });
    }), ngBindTemplateDirective = [
        "$interpolate",
        function($interpolate) {
            return function(scope, element, attr) {
                var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                element.addClass("ng-binding").data("$binding", interpolateFn), attr.$observe("ngBindTemplate", function(value) {
                    element.text(value);
                });
            };
        }, 
    ], ngBindHtmlDirective = [
        "$sce",
        "$parse",
        function($sce, $parse) {
            return function(scope, element, attr) {
                element.addClass("ng-binding").data("$binding", attr.ngBindHtml);
                var parsed = $parse(attr.ngBindHtml);
                scope.$watch(function() {
                    return (parsed(scope) || "").toString();
                }, function(value) {
                    element.html($sce.getTrustedHtml(parsed(scope)) || "");
                });
            };
        }, 
    ];
    function classDirective(name, selector) {
        return name = "ngClass" + name, function() {
            return {
                restrict: "AC",
                link: function(scope, element, attr) {
                    var oldVal;
                    function ngClassWatchAction(newVal) {
                        if (!0 === selector || scope.$index % 2 === selector) {
                            var newClasses = flattenClasses(newVal || "");
                            oldVal ? equals(newVal, oldVal) || attr.$updateClass(newClasses, flattenClasses(oldVal)) : attr.$addClass(newClasses);
                        }
                        oldVal = copy(newVal);
                    }
                    function flattenClasses(classVal) {
                        if (isArray(classVal)) return classVal.join(" ");
                        if (isObject(classVal)) {
                            var classes = [];
                            return forEach(classVal, function(v, k) {
                                v && classes.push(k);
                            }), classes.join(" ");
                        }
                        return classVal;
                    }
                    scope.$watch(attr[name], ngClassWatchAction, !0), attr.$observe("class", function(value) {
                        ngClassWatchAction(scope.$eval(attr[name]));
                    }), "ngClass" !== name && scope.$watch("$index", function($index, old$index) {
                        var mod = 1 & $index;
                        if (mod !== old$index & 1) {
                            var classes = flattenClasses(scope.$eval(attr[name]));
                            mod === selector ? attr.$addClass(classes) : attr.$removeClass(classes);
                        }
                    });
                }
            };
        };
    }
    var ngClassDirective = classDirective("", !0), ngClassOddDirective = classDirective("Odd", 0), ngClassEvenDirective = classDirective("Even", 1), ngCloakDirective = ngDirective({
        compile: function(element, attr) {
            attr.$set("ngCloak", undefined), element.removeClass("ng-cloak");
        }
    }), ngControllerDirective = [
        function() {
            return {
                scope: !0,
                controller: "@",
                priority: 500
            };
        }, 
    ], ngEventDirectives = {};
    forEach("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function(name) {
        var directiveName = directiveNormalize("ng-" + name);
        ngEventDirectives[directiveName] = [
            "$parse",
            function($parse) {
                return {
                    compile: function($element, attr) {
                        var fn = $parse(attr[directiveName]);
                        return function(scope, element, attr) {
                            element.on(lowercase(name), function(event) {
                                scope.$apply(function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                });
                            });
                        };
                    }
                };
            }, 
        ];
    });
    var ngIfDirective = [
        "$animate",
        function($animate) {
            return {
                transclude: "element",
                priority: 600,
                terminal: !0,
                restrict: "A",
                $$tlb: !0,
                link: function($scope, $element, $attr, ctrl, $transclude) {
                    var block, childScope;
                    $scope.$watch($attr.ngIf, function(value) {
                        toBoolean(value) ? childScope || $transclude(childScope = $scope.$new(), function(clone) {
                            clone[clone.length++] = document1.createComment(" end ngIf: " + $attr.ngIf + " "), block = {
                                clone: clone
                            }, $animate.enter(clone, $element.parent(), $element);
                        }) : (childScope && (childScope.$destroy(), childScope = null), block && ($animate.leave(getBlockElements(block.clone)), block = null));
                    });
                }
            };
        }, 
    ], ngIncludeDirective = [
        "$http",
        "$templateCache",
        "$anchorScroll",
        "$animate",
        "$sce",
        function($http, $templateCache, $anchorScroll, $animate, $sce) {
            return {
                restrict: "ECA",
                priority: 400,
                terminal: !0,
                transclude: "element",
                controller: angular1.noop,
                compile: function(element, attr) {
                    var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || "", autoScrollExp = attr.autoscroll;
                    return function(scope, $element, $attr, ctrl, $transclude) {
                        var currentScope, currentElement, changeCounter = 0, cleanupLastIncludeContent = function() {
                            currentScope && (currentScope.$destroy(), currentScope = null), currentElement && ($animate.leave(currentElement), currentElement = null);
                        };
                        scope.$watch($sce.parseAsResourceUrl(srcExp), function(src) {
                            var afterAnimation = function() {
                                isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp)) && $anchorScroll();
                            }, thisChangeId = ++changeCounter;
                            src ? ($http.get(src, {
                                cache: $templateCache
                            }).success(function(response) {
                                if (thisChangeId === changeCounter) {
                                    var newScope = scope.$new();
                                    ctrl.template = response;
                                    var clone1 = $transclude(newScope, function(clone) {
                                        cleanupLastIncludeContent(), $animate.enter(clone, null, $element, afterAnimation);
                                    });
                                    currentScope = newScope, currentElement = clone1, currentScope.$emit("$includeContentLoaded"), scope.$eval(onloadExp);
                                }
                            }).error(function() {
                                thisChangeId === changeCounter && cleanupLastIncludeContent();
                            }), scope.$emit("$includeContentRequested")) : (cleanupLastIncludeContent(), ctrl.template = null);
                        });
                    };
                }
            };
        }, 
    ], ngIncludeFillContentDirective = [
        "$compile",
        function($compile) {
            return {
                restrict: "ECA",
                priority: -400,
                require: "ngInclude",
                link: function(scope, $element, $attr, ctrl) {
                    $element.html(ctrl.template), $compile($element.contents())(scope);
                }
            };
        }, 
    ], ngInitDirective = ngDirective({
        priority: 450,
        compile: function() {
            return {
                pre: function(scope, element, attrs) {
                    scope.$eval(attrs.ngInit);
                }
            };
        }
    }), ngNonBindableDirective = ngDirective({
        terminal: !0,
        priority: 1000
    }), ngPluralizeDirective = [
        "$locale",
        "$interpolate",
        function($locale, $interpolate) {
            var BRACE = /{}/g;
            return {
                restrict: "EA",
                link: function(scope, element, attr) {
                    var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), isWhen = /^when(Minus)?(.+)$/;
                    forEach(attr, function(expression, attributeName) {
                        isWhen.test(attributeName) && (whens[lowercase(attributeName.replace("when", "").replace("Minus", "-"))] = element.attr(attr.$attr[attributeName]));
                    }), forEach(whens, function(expression, key) {
                        whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + "-" + offset + endSymbol));
                    }), scope.$watch(function() {
                        var value = parseFloat(scope.$eval(numberExp));
                        return isNaN(value) ? "" : (value in whens || (value = $locale.pluralCat(value - offset)), whensExpFns[value](scope, element, !0));
                    }, function(newVal) {
                        element.text(newVal);
                    });
                }
            };
        }, 
    ], ngRepeatDirective = [
        "$parse",
        "$animate",
        function($parse, $animate) {
            var NG_REMOVED = "$$NG_REMOVED", ngRepeatMinErr = minErr("ngRepeat");
            return {
                transclude: "element",
                priority: 1000,
                terminal: !0,
                $$tlb: !0,
                link: function($scope, $element, $attr, ctrl, $transclude) {
                    var trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, expression = $attr.ngRepeat, match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/), hashFnLocals = {
                        $id: hashKey
                    };
                    if (!match) throw ngRepeatMinErr("iexp", "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
                    if (lhs = match[1], rhs = match[2], trackByExp = match[4], trackByExp ? (trackByExpGetter = $parse(trackByExp), trackByIdExpFn = function(key, value, index) {
                        return keyIdentifier && (hashFnLocals[keyIdentifier] = key), hashFnLocals[valueIdentifier] = value, hashFnLocals.$index = index, trackByExpGetter($scope, hashFnLocals);
                    }) : (trackByIdArrayFn = function(key, value) {
                        return hashKey(value);
                    }, trackByIdObjFn = function(key) {
                        return key;
                    }), match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/), !match) throw ngRepeatMinErr("iidexp", "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
                    valueIdentifier = match[3] || match[1], keyIdentifier = match[2];
                    var lastBlockMap = {};
                    $scope.$watchCollection(rhs, function(collection) {
                        var index, length, nextNode, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block1, elementsToRemove, previousNode = $element[0], nextBlockMap = {}, nextBlockOrder = [];
                        if (isArrayLike(collection)) collectionKeys = collection, trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                        else {
                            for(key in trackByIdFn = trackByIdExpFn || trackByIdObjFn, collectionKeys = [], collection)collection.hasOwnProperty(key) && "$" != key.charAt(0) && collectionKeys.push(key);
                            collectionKeys.sort();
                        }
                        for(index = 0, arrayLength = collectionKeys.length, length = nextBlockOrder.length = collectionKeys.length; index < length; index++)if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], trackById = trackByIdFn(key, value, index), assertNotHasOwnProperty(trackById, "`track by` id"), lastBlockMap.hasOwnProperty(trackById)) block1 = lastBlockMap[trackById], delete lastBlockMap[trackById], nextBlockMap[trackById] = block1, nextBlockOrder[index] = block1;
                        else if (nextBlockMap.hasOwnProperty(trackById)) throw forEach(nextBlockOrder, function(block) {
                            block && block.scope && (lastBlockMap[block.id] = block);
                        }), ngRepeatMinErr("dupes", "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}", expression, trackById);
                        else nextBlockOrder[index] = {
                            id: trackById
                        }, nextBlockMap[trackById] = !1;
                        for(key in lastBlockMap)lastBlockMap.hasOwnProperty(key) && (elementsToRemove = getBlockElements((block1 = lastBlockMap[key]).clone), $animate.leave(elementsToRemove), forEach(elementsToRemove, function(element) {
                            element[NG_REMOVED] = !0;
                        }), block1.scope.$destroy());
                        for(index = 0, length = collectionKeys.length; index < length; index++){
                            if (key = collection === collectionKeys ? index : collectionKeys[index], value = collection[key], block1 = nextBlockOrder[index], nextBlockOrder[index - 1] && (previousNode = getBlockEnd(nextBlockOrder[index - 1])), block1.scope) {
                                childScope = block1.scope, nextNode = previousNode;
                                do nextNode = nextNode.nextSibling;
                                while (nextNode && nextNode[NG_REMOVED])
                                getBlockStart(block1) != nextNode && $animate.move(getBlockElements(block1.clone), null, jqLite(previousNode)), previousNode = getBlockEnd(block1);
                            } else childScope = $scope.$new();
                            childScope[valueIdentifier] = value, keyIdentifier && (childScope[keyIdentifier] = key), childScope.$index = index, childScope.$first = 0 === index, childScope.$last = index === arrayLength - 1, childScope.$middle = !(childScope.$first || childScope.$last), childScope.$odd = !(childScope.$even = (1 & index) == 0), block1.scope || $transclude(childScope, function(clone) {
                                clone[clone.length++] = document1.createComment(" end ngRepeat: " + expression + " "), $animate.enter(clone, null, jqLite(previousNode)), previousNode = clone, block1.scope = childScope, block1.clone = clone, nextBlockMap[block1.id] = block1;
                            });
                        }
                        lastBlockMap = nextBlockMap;
                    });
                }
            };
            function getBlockStart(block) {
                return block.clone[0];
            }
            function getBlockEnd(block) {
                return block.clone[block.clone.length - 1];
            }
        }, 
    ], ngShowDirective = [
        "$animate",
        function($animate) {
            return function(scope, element, attr) {
                scope.$watch(attr.ngShow, function(value) {
                    $animate[toBoolean(value) ? "removeClass" : "addClass"](element, "ng-hide");
                });
            };
        }, 
    ], ngHideDirective = [
        "$animate",
        function($animate) {
            return function(scope, element, attr) {
                scope.$watch(attr.ngHide, function(value) {
                    $animate[toBoolean(value) ? "addClass" : "removeClass"](element, "ng-hide");
                });
            };
        }, 
    ], ngStyleDirective = ngDirective(function(scope, element, attr) {
        scope.$watch(attr.ngStyle, function(newStyles, oldStyles) {
            oldStyles && newStyles !== oldStyles && forEach(oldStyles, function(val, style) {
                element.css(style, "");
            }), newStyles && element.css(newStyles);
        }, !0);
    }), ngSwitchDirective = [
        "$animate",
        function($animate) {
            return {
                restrict: "EA",
                require: "ngSwitch",
                controller: [
                    "$scope",
                    function() {
                        this.cases = {};
                    }, 
                ],
                link: function(scope, element, attr, ngSwitchController) {
                    var selectedTranscludes, selectedElements, watchExpr = attr.ngSwitch || attr.on, selectedScopes = [];
                    scope.$watch(watchExpr, function(value) {
                        for(var i = 0, ii = selectedScopes.length; i < ii; i++)selectedScopes[i].$destroy(), $animate.leave(selectedElements[i]);
                        selectedElements = [], selectedScopes = [], (selectedTranscludes = ngSwitchController.cases["!" + value] || ngSwitchController.cases["?"]) && (scope.$eval(attr.change), forEach(selectedTranscludes, function(selectedTransclude) {
                            var selectedScope = scope.$new();
                            selectedScopes.push(selectedScope), selectedTransclude.transclude(selectedScope, function(caseElement) {
                                var anchor = selectedTransclude.element;
                                selectedElements.push(caseElement), $animate.enter(caseElement, anchor.parent(), anchor);
                            });
                        }));
                    });
                }
            };
        }, 
    ], ngSwitchWhenDirective = ngDirective({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        compile: function(element7, attrs) {
            return function(scope, element, attr, ctrl, $transclude) {
                ctrl.cases["!" + attrs.ngSwitchWhen] = ctrl.cases["!" + attrs.ngSwitchWhen] || [], ctrl.cases["!" + attrs.ngSwitchWhen].push({
                    transclude: $transclude,
                    element: element
                });
            };
        }
    }), ngSwitchDefaultDirective = ngDirective({
        transclude: "element",
        priority: 800,
        require: "^ngSwitch",
        link: function(scope, element, attr, ctrl, $transclude) {
            ctrl.cases["?"] = ctrl.cases["?"] || [], ctrl.cases["?"].push({
                transclude: $transclude,
                element: element
            });
        }
    }), ngTranscludeDirective = ngDirective({
        controller: [
            "$element",
            "$transclude",
            function($element, $transclude) {
                if (!$transclude) throw minErr("ngTransclude")("orphan", "Illegal use of ngTransclude directive in the template! No parent directive that requires a transclusion found. Element: {0}", startingTag($element));
                this.$transclude = $transclude;
            }, 
        ],
        link: function($scope, $element, $attrs, controller) {
            controller.$transclude(function(clone) {
                $element.empty(), $element.append(clone);
            });
        }
    }), scriptDirective = [
        "$templateCache",
        function($templateCache) {
            return {
                restrict: "E",
                terminal: !0,
                compile: function(element, attr) {
                    if ("text/ng-template" == attr.type) {
                        var templateUrl = attr.id, text = element[0].text;
                        $templateCache.put(templateUrl, text);
                    }
                }
            };
        }, 
    ], ngOptionsMinErr = minErr("ngOptions"), ngOptionsDirective = valueFn1({
        terminal: !0
    }), selectDirective = [
        "$compile",
        "$parse",
        function($compile, $parse) {
            var NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/, nullModelCtrl = {
                $setViewValue: noop
            };
            return {
                restrict: "E",
                require: [
                    "select",
                    "?ngModel"
                ],
                controller: [
                    "$element",
                    "$scope",
                    "$attrs",
                    function($element, $scope, $attrs) {
                        var nullOption, unknownOption, self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl;
                        self.databound = $attrs.ngModel, self.init = function(ngModelCtrl_, nullOption_, unknownOption_) {
                            ngModelCtrl = ngModelCtrl_, nullOption = nullOption_, unknownOption = unknownOption_;
                        }, self.addOption = function(value) {
                            assertNotHasOwnProperty(value, '"option value"'), optionsMap[value] = !0, ngModelCtrl.$viewValue == value && ($element.val(value), unknownOption.parent() && unknownOption.remove());
                        }, self.removeOption = function(value) {
                            this.hasOption(value) && (delete optionsMap[value], ngModelCtrl.$viewValue == value && this.renderUnknownOption(value));
                        }, self.renderUnknownOption = function(val) {
                            var unknownVal = "? " + hashKey(val) + " ?";
                            unknownOption.val(unknownVal), $element.prepend(unknownOption), $element.val(unknownVal), unknownOption.prop("selected", !0);
                        }, self.hasOption = function(value) {
                            return optionsMap.hasOwnProperty(value);
                        }, $scope.$on("$destroy", function() {
                            self.renderUnknownOption = noop;
                        });
                    }, 
                ],
                link: function(scope5, element8, attr, ctrls) {
                    if (ctrls[1]) {
                        for(var scope3, selectElement2, ctrl1, lastView, scope4, selectElement1, ngModelCtrl, selectCtrl, emptyOption, selectCtrl1 = ctrls[0], ngModelCtrl1 = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = !1, optionTemplate = jqLite(document1.createElement("option")), optGroupTemplate = jqLite(document1.createElement("optgroup")), unknownOption = optionTemplate.clone(), i = 0, children = element8.children(), ii = children.length; i < ii; i++)if ("" === children[i].value) {
                            emptyOption = nullOption = children.eq(i);
                            break;
                        }
                        if (selectCtrl1.init(ngModelCtrl1, nullOption, unknownOption), multiple && (attr.required || attr.ngRequired)) {
                            var requiredValidator = function(value) {
                                return ngModelCtrl1.$setValidity("required", !attr.required || value && value.length), value;
                            };
                            ngModelCtrl1.$parsers.push(requiredValidator), ngModelCtrl1.$formatters.unshift(requiredValidator), attr.$observe("required", function() {
                                requiredValidator(ngModelCtrl1.$viewValue);
                            });
                        }
                        optionsExp ? function(scope, selectElement, ctrl) {
                            if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) throw ngOptionsMinErr("iexp", "Expected expression in form of '_select_ (as _label_)? for (_key_,)?_value_ in _collection_' but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
                            var match, displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], keyName = match[5], groupByFn = $parse(match[3] || ""), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), trackFn = match[8] ? $parse(match[8]) : null, optionGroupsCache = [
                                [
                                    {
                                        element: selectElement,
                                        label: ""
                                    }
                                ]
                            ];
                            function render() {
                                var optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, key, groupLength, length, groupIndex, index, selected, lastElement, element, label, optionGroups = {
                                    "": []
                                }, optionGroupNames = [
                                    ""
                                ], modelValue = ctrl.$modelValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, locals = {}, selectedSet = !1;
                                if (multiple) {
                                    if (trackFn && isArray(modelValue)) {
                                        selectedSet = new HashMap([]);
                                        for(var trackIndex = 0; trackIndex < modelValue.length; trackIndex++)locals[valueName] = modelValue[trackIndex], selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
                                    } else selectedSet = new HashMap(modelValue);
                                }
                                for(index = 0; index < (length = keys.length); index++){
                                    if (key = index, keyName) {
                                        if ("$" === (key = keys[index]).charAt(0)) continue;
                                        locals[keyName] = key;
                                    }
                                    if (locals[valueName] = values[key], (optionGroup = optionGroups[optionGroupName = groupByFn(scope, locals) || ""]) || (optionGroup = optionGroups[optionGroupName] = [], optionGroupNames.push(optionGroupName)), multiple) selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                                    else {
                                        if (trackFn) {
                                            var modelCast = {};
                                            modelCast[valueName] = modelValue, selected = trackFn(scope, modelCast) === trackFn(scope, locals);
                                        } else selected = modelValue === valueFn(scope, locals);
                                        selectedSet = selectedSet || selected;
                                    }
                                    label = displayFn(scope, locals), label = isDefined(label) ? label : "", optionGroup.push({
                                        id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                                        label: label,
                                        selected: selected
                                    });
                                }
                                for(multiple || (nullOption || null === modelValue ? optionGroups[""].unshift({
                                    id: "",
                                    label: "",
                                    selected: !selectedSet
                                }) : selectedSet || optionGroups[""].unshift({
                                    id: "?",
                                    label: "",
                                    selected: !0
                                })), groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++){
                                    for(optionGroup = optionGroups[optionGroupName = optionGroupNames[groupIndex]], optionGroupsCache.length <= groupIndex ? (existingOptions = [
                                        existingParent = {
                                            element: optGroupTemplate.clone().attr("label", optionGroupName),
                                            label: optionGroup.label
                                        }
                                    ], optionGroupsCache.push(existingOptions), selectElement.append(existingParent.element)) : (existingParent = (existingOptions = optionGroupsCache[groupIndex])[0]).label != optionGroupName && existingParent.element.attr("label", existingParent.label = optionGroupName), lastElement = null, index = 0, length = optionGroup.length; index < length; index++)option = optionGroup[index], (existingOption = existingOptions[index + 1]) ? (lastElement = existingOption.element, existingOption.label !== option.label && lastElement.text(existingOption.label = option.label), existingOption.id !== option.id && lastElement.val(existingOption.id = option.id), lastElement[0].selected !== option.selected && lastElement.prop("selected", existingOption.selected = option.selected)) : ("" === option.id && nullOption ? element = nullOption : (element = optionTemplate.clone()).val(option.id).attr("selected", option.selected).text(option.label), existingOptions.push(existingOption = {
                                        element: element,
                                        label: option.label,
                                        id: option.id,
                                        selected: option.selected
                                    }), lastElement ? lastElement.after(element) : existingParent.element.append(element), lastElement = element);
                                    for(index++; existingOptions.length > index;)existingOptions.pop().element.remove();
                                }
                                for(; optionGroupsCache.length > groupIndex;)optionGroupsCache.pop()[0].element.remove();
                            }
                            nullOption && ($compile(nullOption)(scope), nullOption.removeClass("ng-scope"), nullOption.remove()), selectElement.empty(), selectElement.on("change", function() {
                                scope.$apply(function() {
                                    var optionGroup, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex, collection = valuesFn(scope) || [], locals = {};
                                    if (multiple) {
                                        for(groupIndex = 0, value = [], groupLength = optionGroupsCache.length; groupIndex < groupLength; groupIndex++)for(index = 1, length = (optionGroup = optionGroupsCache[groupIndex]).length; index < length; index++)if ((optionElement = optionGroup[index].element)[0].selected) {
                                            if (key = optionElement.val(), keyName && (locals[keyName] = key), trackFn) for(trackIndex = 0; trackIndex < collection.length && (locals[valueName] = collection[trackIndex], trackFn(scope, locals) != key); trackIndex++);
                                            else locals[valueName] = collection[key];
                                            value.push(valueFn(scope, locals));
                                        }
                                    } else if ("?" == (key = selectElement.val())) value = undefined;
                                    else if ("" === key) value = null;
                                    else if (trackFn) {
                                        for(trackIndex = 0; trackIndex < collection.length; trackIndex++)if (locals[valueName] = collection[trackIndex], trackFn(scope, locals) == key) {
                                            value = valueFn(scope, locals);
                                            break;
                                        }
                                    } else locals[valueName] = collection[key], keyName && (locals[keyName] = key), value = valueFn(scope, locals);
                                    ctrl.$setViewValue(value);
                                });
                            }), ctrl.$render = render, scope.$watch(render);
                        }(scope5, element8, ngModelCtrl1) : multiple ? (scope3 = scope5, selectElement2 = element8, (ctrl1 = ngModelCtrl1).$render = function() {
                            var items = new HashMap(ctrl1.$viewValue);
                            forEach(selectElement2.find("option"), function(option) {
                                option.selected = isDefined(items.get(option.value));
                            });
                        }, scope3.$watch(function() {
                            equals(lastView, ctrl1.$viewValue) || (lastView = copy(ctrl1.$viewValue), ctrl1.$render());
                        }), selectElement2.on("change", function() {
                            scope3.$apply(function() {
                                var array = [];
                                forEach(selectElement2.find("option"), function(option) {
                                    option.selected && array.push(option.value);
                                }), ctrl1.$setViewValue(array);
                            });
                        })) : (scope4 = scope5, selectElement1 = element8, ngModelCtrl = ngModelCtrl1, selectCtrl = selectCtrl1, ngModelCtrl.$render = function() {
                            var viewValue = ngModelCtrl.$viewValue;
                            selectCtrl.hasOption(viewValue) ? (unknownOption.parent() && unknownOption.remove(), selectElement1.val(viewValue), "" === viewValue && emptyOption.prop("selected", !0)) : isUndefined(viewValue) && emptyOption ? selectElement1.val("") : selectCtrl.renderUnknownOption(viewValue);
                        }, selectElement1.on("change", function() {
                            scope4.$apply(function() {
                                unknownOption.parent() && unknownOption.remove(), ngModelCtrl.$setViewValue(selectElement1.val());
                            });
                        }));
                    }
                }
            };
        }, 
    ], optionDirective = [
        "$interpolate",
        function($interpolate) {
            var nullSelectCtrl = {
                addOption: noop,
                removeOption: noop
            };
            return {
                restrict: "E",
                priority: 100,
                compile: function(element9, attr1) {
                    if (isUndefined(attr1.value)) {
                        var interpolateFn = $interpolate(element9.text(), !0);
                        interpolateFn || attr1.$set("value", element9.text());
                    }
                    return function(scope, element, attr) {
                        var selectCtrlName = "$selectController", parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                        selectCtrl && selectCtrl.databound ? element.prop("selected", !1) : selectCtrl = nullSelectCtrl, interpolateFn ? scope.$watch(interpolateFn, function(newVal, oldVal) {
                            attr.$set("value", newVal), newVal !== oldVal && selectCtrl.removeOption(oldVal), selectCtrl.addOption(newVal);
                        }) : selectCtrl.addOption(attr.value), element.on("$destroy", function() {
                            selectCtrl.removeOption(attr.value);
                        });
                    };
                }
            };
        }, 
    ], styleDirective = valueFn1({
        restrict: "E",
        terminal: !0
    });
    (jQuery = window1.jQuery) ? (jqLite = jQuery, extend(jQuery.fn, {
        scope: JQLitePrototype.scope,
        isolateScope: JQLitePrototype.isolateScope,
        controller: JQLitePrototype.controller,
        injector: JQLitePrototype.injector,
        inheritedData: JQLitePrototype.inheritedData
    }), jqLitePatchJQueryRemove("remove", !0, !0, !1), jqLitePatchJQueryRemove("empty", !1, !1, !1), jqLitePatchJQueryRemove("html", !1, !1, !0)) : jqLite = JQLite, angular1.element = jqLite, function(angular2) {
        extend(angular2, {
            bootstrap: bootstrap1,
            copy: copy,
            extend: extend,
            equals: equals,
            element: jqLite,
            forEach: forEach,
            injector: createInjector,
            noop: noop,
            bind: bind,
            toJson: toJson,
            fromJson: fromJson,
            identity: identity,
            isUndefined: isUndefined,
            isDefined: isDefined,
            isString: isString,
            isFunction: isFunction,
            isObject: isObject,
            isNumber: isNumber,
            isElement: isElement,
            isArray: isArray,
            version: version,
            isDate: isDate,
            lowercase: lowercase,
            uppercase: uppercase,
            callbacks: {
                counter: 0
            },
            $$minErr: minErr,
            $$csp: csp
        }), angularModule = function(window) {
            var $injectorMinErr = minErr("$injector"), ngMinErr = minErr("ng");
            function ensure(obj, name, factory) {
                return obj[name] || (obj[name] = factory());
            }
            var angular = ensure(window, "angular", Object);
            return angular.$$minErr = angular.$$minErr || minErr, ensure(angular, "module", function() {
                var modules = {};
                return function(name2, requires, configFn) {
                    return function(name, context) {
                        if ("hasOwnProperty" === name) throw ngMinErr("badname", "hasOwnProperty is not a valid {0} name", context);
                    }(name2, "module"), requires && modules.hasOwnProperty(name2) && (modules[name2] = null), ensure(modules, name2, function() {
                        if (!requires) throw $injectorMinErr("nomod", "Module '{0}' is not available! You either misspelled the module name or forgot to load it. If registering a module ensure that you specify the dependencies as the second argument.", name2);
                        var invokeQueue = [], runBlocks = [], config = invokeLater("$injector", "invoke"), moduleInstance = {
                            _invokeQueue: invokeQueue,
                            _runBlocks: runBlocks,
                            requires: requires,
                            name: name2,
                            provider: invokeLater("$provide", "provider"),
                            factory: invokeLater("$provide", "factory"),
                            service: invokeLater("$provide", "service"),
                            value: invokeLater("$provide", "value"),
                            constant: invokeLater("$provide", "constant", "unshift"),
                            animation: invokeLater("$animateProvider", "register"),
                            filter: invokeLater("$filterProvider", "register"),
                            controller: invokeLater("$controllerProvider", "register"),
                            directive: invokeLater("$compileProvider", "directive"),
                            config: config,
                            run: function(block) {
                                return runBlocks.push(block), this;
                            }
                        };
                        return configFn && config(configFn), moduleInstance;
                        function invokeLater(provider, method, insertMethod) {
                            return function() {
                                return invokeQueue[insertMethod || "push"]([
                                    provider,
                                    method,
                                    arguments, 
                                ]), moduleInstance;
                            };
                        }
                    });
                };
            });
        }(window1);
        try {
            angularModule("ngLocale");
        } catch (e) {
            angularModule("ngLocale", []).provider("$locale", $LocaleProvider);
        }
        angularModule("ng", [
            "ngLocale"
        ], [
            "$provide",
            function($provide) {
                $provide.provider({
                    $$sanitizeUri: $$SanitizeUriProvider
                }), $provide.provider("$compile", $CompileProvider).directive({
                    a: htmlAnchorDirective,
                    input: inputDirective,
                    textarea: inputDirective,
                    form: formDirective,
                    script: scriptDirective,
                    select: selectDirective,
                    style: styleDirective,
                    option: optionDirective,
                    ngBind: ngBindDirective,
                    ngBindHtml: ngBindHtmlDirective,
                    ngBindTemplate: ngBindTemplateDirective,
                    ngClass: ngClassDirective,
                    ngClassEven: ngClassEvenDirective,
                    ngClassOdd: ngClassOddDirective,
                    ngCloak: ngCloakDirective,
                    ngController: ngControllerDirective,
                    ngForm: ngFormDirective,
                    ngHide: ngHideDirective,
                    ngIf: ngIfDirective,
                    ngInclude: ngIncludeDirective,
                    ngInit: ngInitDirective,
                    ngNonBindable: ngNonBindableDirective,
                    ngPluralize: ngPluralizeDirective,
                    ngRepeat: ngRepeatDirective,
                    ngShow: ngShowDirective,
                    ngStyle: ngStyleDirective,
                    ngSwitch: ngSwitchDirective,
                    ngSwitchWhen: ngSwitchWhenDirective,
                    ngSwitchDefault: ngSwitchDefaultDirective,
                    ngOptions: ngOptionsDirective,
                    ngTransclude: ngTranscludeDirective,
                    ngModel: ngModelDirective,
                    ngList: ngListDirective,
                    ngChange: ngChangeDirective,
                    required: requiredDirective,
                    ngRequired: requiredDirective,
                    ngValue: function() {
                        return {
                            priority: 100,
                            compile: function(tpl, tplAttr) {
                                return CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue) ? function(scope, elm, attr) {
                                    attr.$set("value", scope.$eval(attr.ngValue));
                                } : function(scope, elm, attr) {
                                    scope.$watch(attr.ngValue, function(value) {
                                        attr.$set("value", value);
                                    });
                                };
                            }
                        };
                    }
                }).directive({
                    ngInclude: ngIncludeFillContentDirective
                }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives), $provide.provider({
                    $anchorScroll: $AnchorScrollProvider,
                    $animate: $AnimateProvider,
                    $browser: $BrowserProvider,
                    $cacheFactory: $CacheFactoryProvider,
                    $controller: $ControllerProvider,
                    $document: $DocumentProvider,
                    $exceptionHandler: $ExceptionHandlerProvider,
                    $filter: $FilterProvider,
                    $interpolate: $InterpolateProvider,
                    $interval: $IntervalProvider,
                    $http: $HttpProvider,
                    $httpBackend: $HttpBackendProvider,
                    $location: $LocationProvider,
                    $log: $LogProvider,
                    $parse: $ParseProvider,
                    $rootScope: $RootScopeProvider,
                    $q: $QProvider,
                    $sce: $SceProvider,
                    $sceDelegate: $SceDelegateProvider,
                    $sniffer: $SnifferProvider,
                    $templateCache: $TemplateCacheProvider,
                    $timeout: $TimeoutProvider,
                    $window: $WindowProvider
                });
            }, 
        ]);
    }(angular1), jqLite(document1).ready(function() {
        !function(element10, bootstrap) {
            var appElement, module, elements = [
                element10
            ], names = [
                "ng:app",
                "ng-app",
                "x-ng-app",
                "data-ng-app"
            ], NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
            function append(element) {
                element && elements.push(element);
            }
            forEach(names, function(name) {
                names[name] = !0, append(document1.getElementById(name)), name = name.replace(":", "\\:"), element10.querySelectorAll && (forEach(element10.querySelectorAll("." + name), append), forEach(element10.querySelectorAll("." + name + "\\:"), append), forEach(element10.querySelectorAll("[" + name + "]"), append));
            }), forEach(elements, function(element) {
                if (!appElement) {
                    var className = " " + element.className + " ", match = NG_APP_CLASS_REGEXP.exec(className);
                    match ? (appElement = element, module = (match[2] || "").replace(/\s+/g, ",")) : forEach(element.attributes, function(attr) {
                        !appElement && names[attr.name] && (appElement = element, module = attr.value);
                    });
                }
            }), appElement && bootstrap(appElement, module ? [
                module
            ] : []);
        }(document1, bootstrap1);
    });
}(window, document), angular.$$csp() || angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-start{border-spacing:1px 1px;-ms-zoom:1.0001;}.ng-animate-active{border-spacing:0px 0px;-ms-zoom:1;}</style>');
